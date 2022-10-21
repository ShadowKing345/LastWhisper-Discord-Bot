import { Client as DiscordClient, GatewayIntentBits, Collection, ClientEvents } from "discord.js";
import { EventListeners } from "./eventListener.js";

/**
 * Custom client class to hold the additional information about a discord client and the set-up flags.
 */
export class Client extends DiscordClient {
    public readonly events: Collection<keyof ClientEvents, EventListeners> = new Collection<keyof ClientEvents, EventListeners>();

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
            ],
        });
    }
}
