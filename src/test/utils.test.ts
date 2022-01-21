import {fetchMessages} from "../code/utils";
import {Channel, Client, Guild, Message, TextChannel} from "discord.js";

describe("Fetch Messages", () => {
    let messages: Message[] = [];

    const channel: TextChannel = {
        messages: {
            fetch: jest.fn(message => Promise.resolve(messages.find(m => m.id === message))) as (message) => Promise<Message>,
        }
    } as TextChannel;
    const guild: Guild = {
        channels: {
            fetch: jest.fn(id => Promise.resolve(id === names.channel ? channel as Channel : null)) as (id) => Promise<Channel>
        }
    } as Guild;
    const client: Client = {
        guilds: {
            fetch: jest.fn(options => Promise.resolve(options === names.guild ? guild : null)) as (options) => Promise<Guild>
        }
    } as Client;
    const names = {
        guild: "Example Guild",
        channel: "Example Channel"
    }

    beforeEach(() => {
        jest.clearAllMocks();
        messages = [];
    });

    it("Has messages.", () => {
        messages = [{id: "1"} as Message, {id: "2"} as Message, {id: "3"} as Message];
        fetchMessages(client, names.guild, names.channel, messages.map(m => m.id)).then(result => {
            expect(client.guilds.fetch).toHaveBeenCalledWith(names.guild);
            expect(guild.channels.fetch).toHaveBeenCalledWith(names.channel);
            expect(channel.messages.fetch).toHaveBeenNthCalledWith(1, messages[0].id);
            expect(channel.messages.fetch).toHaveBeenNthCalledWith(2, messages[1].id);
            expect(channel.messages.fetch).toHaveBeenNthCalledWith(3, messages[2].id);
            expect(result).toEqual(messages);
        });
    });

    it("Does not have messages.", () => {
        messages = [{id: "1"} as Message, {id: "3"} as Message];
        fetchMessages(client, names.guild, names.channel, ["1", "2", "3"]).then(result => {
            expect(result).toEqual(messages);
        });
    });

    it("Null Message", () => {
        messages = [{id: "1"} as Message, {id: "3"} as Message];
        fetchMessages(client, names.guild, names.channel, ["1", null, "3"]).then(result => {
            expect(result).toEqual(messages);
        });
    });
});