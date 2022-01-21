import {
    createEvent,
    deleteEvent,
    event,
    getConfig,
    parseMessage,
    parseTriggerDuration,
    reminderLoop,
    updateEvent
} from "../../code/modules/eventManager"
import {EventManagerConfig, EventObj, ReminderTrigger, Tags} from "../../code/objects/EventManager";
import {Channel, CommandInteraction, EmbedField, Guild, Message, MessageReaction, TextChannel,} from "discord.js";
import Client from "../utils/Client";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Mock = jest.Mock;

dayjs.extend(duration);

let data: EventManagerConfig[] = [
    {
        _id: "correct",
        dateTimeFormat: [],
        delimiterCharacters: ["\\[", "\\]"],
        events: [],
        listenerChannelId: "123",
        postingChannelId: "123",
        reminders: [],
        tags: {
            announcement: "Event Announcement",
            dateTime: "Time",
            description: "Event Description",
            exclusionList: ["Ignore"],
        } as Tags,
    } as EventManagerConfig
];

jest.mock("../../src/models/EventManager", () =>
    ({
        find: async (_) => {
            return data;
        },
        bulkSave: async (_) => {

        },
        findOne: async (filter) => {
            for (let [key, value] of Object.entries(filter)) {
                let found = data.find(entry => entry[key] && entry[key] === value);
                if (found != null) {
                    found["save"] = async function () {
                    }
                    return found;
                }
            }

            return null;
        },
        create: async (docs) => {
            let obj = new EventManagerConfig();
            for (let [key, value] of Object.entries(docs)) {
                obj[key] = value;
            }

            obj["save"] = async function () {
            }
            return obj;
        },
    }));

let client: Client = new Client();
beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(1636976220000);
});

describe("Event Parser", () => {
    let config: EventManagerConfig = new EventManagerConfig();
    config.tags.exclusionList.push("Ignore");

    describe("Valid Message", () => {
        let content = `[ Event Announcement ]
        Example Title
        
        [ Event Description ]
        Example Description
        
        [ Example Tag 1 ]
        Test info!
        
        [ Ignore ]
        This should be ignored.
        
        [ Time ]
        <t:1636976220:D>`;
        let result = parseMessage(null, content, config);

        it("Is Valid", () => expect(result.isValid).toBe(true));
        it("Equivalent Check", () => expect(result).toEqual(new EventObj(null, "Example Title", "Example Description", new Date(1636976220 * 1000), [["Example Tag 1", "Test info!"]])));
        it("Ignored Additional", () => expect(result.additional.filter(l => l === ["Ignore", "This should be ignored."])).toEqual([]));
    });

    it("No Valid Tags", () => expect(parseMessage(null, "yolo", config).isValid).toBe(false));
    it("Empty Paragraph", () => expect(parseMessage(null, "", config).isValid).toBe(false));
    it("Missing Tag Value", () => expect(parseMessage(null, "[Event Announcement]", config).isValid).toBe(false));
    it("Null Message", () => expect(parseMessage(null, null, config).isValid).toBe(false));
    it("Message has weird lines.", async () => {
        let content = `@everyone
            
            [ Event Announcement ]
            Example Title
            
            [ Event Description ]
            Example Description
            
            [ Example Tag 1 ]
            Test info!
            
            [ Ignore ]
            This should be ignored.
            
            [ Time ]
            <t:1636976220:D>`;

        expect(parseMessage(null, content, config).isValid).toBe(true);
    });
});

describe("Acquiring configs", () => {
    it("Correct Id", async () => expect(await getConfig("correct")).toBeDefined());
    it("Incorrect Id", async () => expect(await getConfig("nope")).toBeDefined());
    it("Empty Id, Should Throw", () => expect(getConfig("")).rejects.toBeInstanceOf(ReferenceError))
    it("Null Id, Should Throw", () => expect(getConfig(null)).rejects.toBeInstanceOf(ReferenceError));
});

describe("Create Event", () => {
    let content = `[ Event Announcement ]
        Example Title
        
        [ Event Description ]
        Example Description
        
        [ Example Tag 1 ]
        Test info!
        
        [ Ignore ]
        This should be ignored.
        
        [ Time ]
        <t:1636976220:D>`;
    let message: Message;

    beforeEach(() => {
        message = {
            author: {id: "1"},
            client: {application: {id: "2"}},
            id: "createMessage",
            guildId: "correct",
            content: content,
            channelId: "123",
            react: jest.fn() as (emoji) => Promise<MessageReaction>
        } as Message;
        data[0].events = [];
    });

    it("Is Author Bot?", async () => {
        message.author.id = "2";
        await createEvent(message);
        expect(message.react).not.toHaveBeenCalled();
    });
    it("GuildId Invalid", async () => {
        message.guildId = "wrong id";
        await createEvent(message);
        expect(message.react).not.toHaveBeenCalled();
    });

    it("Correct Message", async () => {
        await createEvent(message);
        expect(message.react).toHaveBeenCalledWith("✅");
        expect(data[0].events).toContainEqual(new EventObj("createMessage", "Example Title", "Example Description", new Date(1636976220 * 1000), [["Example Tag 1", "Test info!"]]));
    });
    it("Incorrect Announcement Tags / Null Message", async () => {
        message.content = "";
        await createEvent(message);
        expect(message.react).not.toHaveBeenCalled();

        message.content = null;
        await createEvent(message);
        expect(message.react).not.toHaveBeenCalled();
    });
    it("Incorrect Message", async () => {
        message.content = "[ Event Announcement ]\nExample Title";
        await createEvent(message);
        expect(message.react).toHaveBeenCalledWith("❎");
    });
});

describe("Update Event", () => {
    let content = `[ Event Announcement ]
        Example Title
        
        [ Event Description ]
        Example Description
        
        [ Example Tag 1 ]
        Test info!
        
        [ Ignore ]
        This should be ignored.
        
        [ Time ]
        <t:1636976220:D>`;
    let oldMessage: Message;
    let newMessage: Message;
    let resultEvent = new EventObj("updateEvent", "Example Title", "Example Description", new Date(1636976220 * 1000), [["Example Tag 1", "Test info!"]]);

    beforeEach(() => {
        oldMessage = {
            id: "updateEvent",
            guildId: "correct",
            channelId: "123",
        } as Message;
        newMessage = {
            content: content,
            react: jest.fn() as (emoji) => Promise<MessageReaction>,
            reactions: {
                cache: {
                    find: (fn) => {
                        let data = [
                            {
                                users: {
                                    remove: _ => {
                                    }
                                }
                            } as MessageReaction
                        ];
                        return data.find(fn);
                    }
                }
            }
        } as Message;
        data[0].events = [
            {
                messageId: "updateEvent",
                name: "Title",
                description: "Description",
                dateTime: new Date(1636976220 * 1000),
                additional: [
                    ["Entry 1", "Fish"]
                ]
            } as EventObj,
        ];
    });

    it("Correct Id, Correct Message", async () => {
        await updateEvent(oldMessage, newMessage);
        expect(newMessage.react).toHaveBeenCalledWith("✅");
        expect(data[0].events).toContainEqual(resultEvent);
    });
    it("Correct Id, Incorrect Message", async () => {
        newMessage.content = "";
        await updateEvent(oldMessage, newMessage);
        expect(newMessage.react).toHaveBeenCalledWith("❎");
        expect(data[0].events.find(e => e.messageId === oldMessage.id)).not.toEqual(resultEvent);
    });
    it("Correct Id, Null Message", async () => {
        newMessage.content = null;
        await updateEvent(oldMessage, newMessage);
        expect(newMessage.react).toHaveBeenCalledWith("❎");
        expect(data[0].events.find(e => e.messageId === oldMessage.id)).not.toEqual(resultEvent);
    });
    it("Incorrect Id", async () => {
        oldMessage.id = "Wrong Id";
        await updateEvent(oldMessage, newMessage);
        expect(newMessage.react).not.toHaveBeenCalled();
        expect(data[0].events).not.toContainEqual(resultEvent);
    });
});

describe("Delete Event", () => {
    let result = {
        messageId: "deleteEvent",
    } as EventObj;
    let message: Message;

    beforeEach(() => {
        message = {
            id: "deleteEvent",
            guildId: "correct",
        } as Message;
        data[0].events = [result];
    });

    it("Correct Id", async () => {
        await deleteEvent(message);
        expect(data[0].events).not.toContainEqual(result);
    });
    it("Incorrect Id", async () => {
        message.id = "Wrong Id";
        await deleteEvent(message);
        expect(data[0].events).toContainEqual(result);
    });
    it("Null Id", async () => {
        message.id = null;
        await deleteEvent(message);
        expect(data[0].events).toContainEqual(result);
    });
});

describe("Event Command", () => {
    let interaction: CommandInteraction;
    let index;
    const events = [
        {
            messageId: "eventCommand",
            name: "Event Command Event",
            description: "Test Event Description",
            dateTime: new Date(1636976220 * 1000),
            additional: [
                ["Entry 1", "Fish"]
            ]
        } as EventObj,
        {
            messageId: "eventCommand2",
            name: "Event Command Event 2",
            description: "Test Event Description 2",
            dateTime: new Date(1636976220 * 1000),
            additional: [
                ["Entry 1", "Fish"],
                ["Entry 2", "Test"]
            ]
        } as EventObj,
    ];
    const time = dayjs(events[0].dateTime).unix();
    const eventEmbed = {
        title: events[0].name,
        description: events[0].description,
        fields: events[0].additional.map(l => ({
            name: l[0],
            value: l[1],
            inline: false
        } as EmbedField)).concat([
            {name: "Time Remaining:", value: `<t:${time}:R>`, inline: false} as EmbedField,
            {name: "Set For:", value: `<t:${time}:f>`, inline: false} as EmbedField
        ])
    };
    const failedEmbed = {
        fields: [{name: "Notice", value: "There are no upcoming events!", inline: false} as EmbedField]
    };
    const eventsEmbed = {
        title: "Upcoming Events",
        fields: events.map((e, i) => ({
            name: `Index ${i}:`,
            value: `${e.name}\n**Begins: <t:${dayjs(e.dateTime).unix()}:R>**`,
            inline: false,
        } as EmbedField))
    };

    beforeEach(() => {
        interaction = {
            guildId: "correct",
            options: {
                getInteger: jest.fn(_ => index) as (name) => number | undefined
            },
            reply: jest.fn() as (options) => Promise<void>,
        } as CommandInteraction;
        data[0].events = events;
    })

    it("Number Index, Inside Range", async () => {
        index = 0;
        await event(interaction);
        expect(interaction.reply).toHaveBeenCalledWith({embeds: [expect.objectContaining(eventEmbed)]});
    });
    it("Number Index, Outside Range", async () => {
        index = 2;
        await event(interaction);
        expect(interaction.reply).toHaveBeenCalledWith({embeds: [expect.objectContaining(eventEmbed)]});
    });
    it("Null Index", async () => {
        index = null;
        await event(interaction);
        expect(interaction.reply).toHaveBeenCalledWith({embeds: [expect.objectContaining(eventsEmbed)]});
    });
    it("No Events", async () => {
        index = 16;
        data[0].events = [];
        await event(interaction);
        expect(interaction.reply).toHaveBeenCalledWith({embeds: [expect.objectContaining(failedEmbed)]});
    });
});

describe("Parse Time Delta Duration", () => {
    it("Correct Format", () => {
        expect(parseTriggerDuration("12:30")).toBeDefined();
    });
    it("Format Outside Range", () => {
        expect(() => parseTriggerDuration("24:00")).toThrow(RangeError);
    })
    it("Wrong Format", () => {
        expect(() => parseTriggerDuration("wrong")).toThrow(SyntaxError);
        expect(() => parseTriggerDuration("dsadsa:1231")).toThrow(TypeError);
    });
    it("Null", () => {
        expect(() => parseTriggerDuration(null)).toThrow(TypeError);
    })
});

describe("Reminder Loop", () => {
    const channel: TextChannel = {
        id: "123",
        send: jest.fn() as (options) => Promise<Message>
    } as TextChannel;

    const guild: Guild = {
        id: "correct",
        channels: {
            fetch: jest.fn(async options => options === channel.id ? channel : null) as (options) => Promise<Channel>
        }
    } as Guild;
    client.addGuild(guild);
    client.addChannel(channel);

    const event: EventObj = {
        name: "Event Command Event",
        description: "Test Event Description",
        dateTime: new Date(1636976220 * 1000),
    } as EventObj;

    const pastEvent: EventObj = {
        name: "Missing Event",
        description: "Test Event Description",
        dateTime: new Date(1636976000 * 1000),
    } as EventObj;

    const correctReminder: ReminderTrigger = {
        message: "Test",
        timeDelta: "00:00",
    }

    const wrongReminder: ReminderTrigger = {
        message: "This message should never be posted",
        timeDelta: "12:22",
    }

    const d = data[0];

    beforeEach(() => {
        d.events = [
            event,
            pastEvent
        ];
        d.reminders = [correctReminder];

        guild.id = "correct";
        channel.id = "123";
        (client.guilds.fetch as Mock).mockClear();
        (channel.send as Mock).mockClear();
        (guild.channels.fetch as Mock).mockClear();
    });

    it("Posts Reminder", async () => {
        d.reminders.push(wrongReminder)
        await reminderLoop(client);

        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send).toHaveBeenCalledWith(data[0].reminders[0].message);
    });
    it("Clears Event", async () => {
        await reminderLoop(client);

        expect(data[0].events).not.toContain(pastEvent);
    });

    it('Formats String With Event Data', async () => {
        data[0].reminders = [{
            timeDelta: "00:00",
            message: "Test %everyone% %eventName% %hourDiff% %minuteDiff% %ignored%"
        }];
        await reminderLoop(client);

        expect(channel.send).toHaveBeenCalledWith(`Test @everyone ${event.name} 0 0 %ignored%`);
    });

    it("Is In Guild", async () => {
        await reminderLoop(client);

        expect(client.guilds.fetch).toHaveBeenCalledWith("correct");
        expect(channel.send).toHaveBeenCalled();
    });
    it("Is Not In Guild", async () => {
        guild.id = "wrong";
        await reminderLoop(client);

        expect(client.guilds.fetch).toHaveBeenCalledWith("correct");
        expect(channel.send).not.toHaveBeenCalled();
    });

    it("Guild Has Channel", async () => {
        await reminderLoop(client);

        expect(guild.channels.fetch).toHaveBeenCalledWith("123");
        expect(channel.send).toHaveBeenCalled();
    });
    it("Guild Does Not Have Channel", async () => {
        channel.id = "Wrong";
        await reminderLoop(client);

        expect(guild.channels.fetch).toHaveBeenCalledWith("123");
        expect(channel.send).not.toHaveBeenCalled();
    });
});

afterAll(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
});