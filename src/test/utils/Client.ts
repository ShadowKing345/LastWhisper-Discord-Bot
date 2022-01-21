import BaseClient from "../../code/classes/Client"
import {Channel, ChannelManager, Guild, GuildManager, Intents} from "discord.js";

export default class Client extends BaseClient {
    private readonly _guilds: Guild[];
    private readonly _channels: Channel[];

    constructor() {
        super({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});

        this._guilds = [];
        this._channels = [];

        this.guilds = {
            fetch: jest.fn(async options => this._guilds.find(guild => guild.id === options)) as (options) => Promise<Guild>
        } as GuildManager;

        this.channels = {
            fetch: jest.fn(async channelId => this._channels.find(channel => channel.id === channelId)) as (channelId) => Promise<Channel>
        } as ChannelManager;
    }

    addGuild(guild: Guild) {
        this._guilds.push(guild);
    }

    addChannel(channel: Channel) {
        this._channels.push(channel);
    }
}