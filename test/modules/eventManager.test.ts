import {createEvent, getConfig, parseMessage} from "../../src/modules/eventManager"
import {EventManagerConfig, EventObj, Tags} from "../../src/objects/EventManager";
import {Message, MessageReaction} from "discord.js";

jest.mock("../../src/models/EventManager", () => {
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
    ]

    return ({
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
    });
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
    let config: EventManagerConfig = new EventManagerConfig();
    config.tags.exclusionList.push("Ignore");
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
            id: "1234",
            guildId: "correct",
            content: content,
            channelId: "123",
            react: jest.fn() as (emoji) => Promise<MessageReaction>
        } as Message;
        jest.resetAllMocks();
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
        console.log(message)
        await createEvent(message);
        expect(message.react).toHaveBeenCalledWith("✅");
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
    it.todo("Correct Id, Correct Message");
    it.todo("Correct Id, Incorrect Message");
    it.todo("Correct Id, Null Message");
    it.todo("Incorrect Id, Correct Message");
    it.todo("Incorrect Id, Incorrect Message");
    it.todo("Incorrect Id, Null Message");
});

describe("Delete Event", () => {
    it.todo("Correct Id");
    it.todo("Incorrect Id");
    it.todo("Null Id");
});

describe("Reminder Loop", () => {
    it.todo("Work on testing idea.")
});

describe("Event Command", () => {
    it.todo("Number Index, Inside Range");
    it.todo("Number Index, Outside Range");
    it.todo("Null Index");
    it.todo("No Events");
});