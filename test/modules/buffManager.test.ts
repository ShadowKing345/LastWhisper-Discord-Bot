import {createDayEmbed, postBuff, postDailyMessage} from "../../src/modules/buffManager";
import {BuffManagerConfig, Day, MessageSettings, Week} from "../../src/objects/BuffManager";
import dayjs, {Dayjs} from "dayjs";
import {Channel, CommandInteraction, Guild, Message, MessageEmbed, TextChannel} from "discord.js";
import weekOfYear from "dayjs/plugin/weekOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Client from "../utils/Client";
import Mock = jest.Mock;

dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);

const data = {
    _id: "correct",
    messageSettings: {
        channelId: "123",
        hour: "00:00",
        dow: null,
        buffMessage: "Test Buff Message",
        weekMessage: "Test Week Message"
    } as MessageSettings,
} as BuffManagerConfig;
data["save"] = () => {
};

jest.mock("../../src/models/BuffManager", () =>
    ({
        find: async (_) => [data],
        bulkSave: async (_) => {
        },
        findOne: async (filter) => filter._id === "correct" ? data : null,
        create: async (docs) => {
            let obj = new BuffManagerConfig();
            for (let [key, value] of Object.entries(docs)) {
                obj[key] = value;
            }

            obj["save"] = async () => {
            }
            return obj;
        },
    })
);

beforeAll(jest.useFakeTimers);
const client = new Client();

it("Create Day Embed", () => {
    const day: Day = new Day();
    const unix: Dayjs = dayjs.unix(0);
    const embed: MessageEmbed = {
        title: "Test Title", description: day.text,
        thumbnail: expect.objectContaining({url: day.imageUrl}),
        footer: {
            text: unix.format("dddd Do MMMM YYYY")
        },
    } as MessageEmbed;

    expect(createDayEmbed("Test Title", day, unix)).toEqual(expect.objectContaining(embed));
});

describe("Post Day Embeds", () => {
    const days: { [key: string]: Day } = {
        Monday: {
            id: "1",
            text: "Monday",
        } as Day,
        Tuesday: {
            id: "2",
            text: "Tuesday",
        } as Day,
        Wednesday: {
            id: "3",
            text: "Wednesday",
        } as Day,
        Thursday: {
            id: "4",
            text: "Thursday",
        } as Day,
        Friday: {
            id: "5",
            text: "Friday",
        } as Day,
        Saturday: {
            id: "6",
            text: "Saturday",
        } as Day,
        Sunday: {
            id: "7",
            text: "Sunday",
        } as Day
    };
    const week: Week = {
        title: "Test Week",
        days: {
            monday: days.Monday.id,
            tuesday: days.Tuesday.id,
            wednesday: days.Wednesday.id,
            thursday: days.Thursday.id,
            friday: days.Friday.id,
            saturday: days.Saturday.id,
            sunday: days.Sunday.id
        }
    } as Week;
    const embed: MessageEmbed = {
        title: "Test Title",
    } as MessageEmbed;
    const interaction: CommandInteraction = {
        guildId: "correct",
        reply: jest.fn() as (options) => Promise<Message>
    } as CommandInteraction;

    beforeEach(() => {
        data.days = Object.values(days) as Day[];
        data.weeks = [week];
        (interaction.reply as Mock).mockClear();
    });

    it("Monday", async () => {
        const date = dayjs().day(1);
        embed.description = days.Monday.text;
        await postBuff(interaction, date, "Test Title");

        expect(interaction.reply).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
    it("Tuesday", async () => {
        const date = dayjs().day(2);
        embed.description = days.Tuesday.text;
        await postBuff(interaction, date, "Test Title");

        expect(interaction.reply).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
    it("Wednesday", async () => {
        const date = dayjs().day(3);
        embed.description = days.Wednesday.text;
        await postBuff(interaction, date, "Test Title");

        expect(interaction.reply).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
    it("Thursday", async () => {
        const date = dayjs().day(4);
        embed.description = days.Thursday.text;
        await postBuff(interaction, date, "Test Title");

        expect(interaction.reply).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
    it("Friday", async () => {
        const date = dayjs().day(5);
        embed.description = days.Friday.text;
        await postBuff(interaction, date, "Test Title");

        expect(interaction.reply).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
    it("Saturday", async () => {
        const date = dayjs().day(6);
        embed.description = days.Saturday.text;
        await postBuff(interaction, date, "Test Title");

        expect(interaction.reply).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
    it("Sunday", async () => {
        const date = dayjs().day(0);
        embed.description = days.Sunday.text;
        await postBuff(interaction, date, "Test Title");

        expect(interaction.reply).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
});

describe("Post Week Embed", () => {

});

describe("Daily Post", () => {
    const days: { [key: string]: Day } = {
        Monday: {
            id: "1",
            text: "Monday",
        } as Day,
        Tuesday: {
            id: "2",
            text: "Tuesday",
        } as Day,
        Wednesday: {
            id: "3",
            text: "Wednesday",
        } as Day,
        Thursday: {
            id: "4",
            text: "Thursday",
        } as Day,
        Friday: {
            id: "5",
            text: "Friday",
        } as Day,
        Saturday: {
            id: "6",
            text: "Saturday",
        } as Day,
        Sunday: {
            id: "7",
            text: "Sunday",
        } as Day
    };
    const week: Week = {
        title: "Test Week",
        days: {
            monday: days.Monday.id,
            tuesday: days.Tuesday.id,
            wednesday: days.Wednesday.id,
            thursday: days.Thursday.id,
            friday: days.Friday.id,
            saturday: days.Saturday.id,
            sunday: days.Sunday.id
        }
    } as Week;
    const embed: MessageEmbed = {
        title: "Test Buff Message",
    } as MessageEmbed;

    const channel: TextChannel = {
        send: jest.fn() as (options) => Promise<Message>
    } as TextChannel;
    const guild: Guild = {
        id: "correct",
        channels: {
            fetch: jest.fn(async id => id === "123" ? channel : null) as (id) => Promise<Channel>
        }
    } as Guild;
    client.addGuild(guild);

    beforeEach(() => {
        data.days = Object.values(days);
        data.weeks = [week];

        (channel.send as Mock).mockClear();
    });

    it("Monday", async () => {
        jest.setSystemTime(1639353600000);
        embed.description = days.Monday.text;
        await postDailyMessage(client);

        expect(channel.send).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
    it("Tuesday", async () => {
        jest.setSystemTime(1639440000000);
        embed.description = days.Tuesday.text;
        await postDailyMessage(client);

        expect(channel.send).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
    it("Wednesday", async () => {
        jest.setSystemTime(1639526400000);
        embed.description = days.Wednesday.text;
        await postDailyMessage(client);

        expect(channel.send).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
    it("Thursday", async () => {
        jest.setSystemTime(1639612800000);
        embed.description = days.Thursday.text;
        await postDailyMessage(client);

        expect(channel.send).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
    it("Friday", async () => {
        jest.setSystemTime(1639699200000);
        embed.description = days.Friday.text;
        await postDailyMessage(client);

        expect(channel.send).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
    it("Saturday", async () => {
        jest.setSystemTime(1639785600000);
        embed.description = days.Saturday.text;
        await postDailyMessage(client);

        expect(channel.send).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
    it("Sunday", async () => {
        jest.setSystemTime(1639872000000);
        embed.description = days.Sunday.text;
        await postDailyMessage(client);

        expect(channel.send).toHaveBeenCalledWith({embeds: [expect.objectContaining(embed)]});
    });
});

afterAll(jest.resetAllMocks);
