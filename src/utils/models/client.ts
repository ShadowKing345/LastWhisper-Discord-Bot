import { Client as DiscordClient, GatewayIntentBits } from "discord.js";

/**
 * Custom client class to hold the additional information about a discord client and the set up flags.
 */
export class Client extends DiscordClient {
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
