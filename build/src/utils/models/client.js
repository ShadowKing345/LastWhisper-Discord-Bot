import { Client as DiscordClient, GatewayIntentBits, Collection } from "discord.js";
/**
 * Custom client class to hold the additional information about a discord client and the set-up flags.
 */
export class Client extends DiscordClient {
    events = new Collection();
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
//# sourceMappingURL=client.js.map