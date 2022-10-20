import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
/**
 * Custom client class to hold the additional information about a discord client.
 */
export class Client extends DiscordClient {
    // private readonly _modules: Collection<string, ModuleBase> = new Collection<string, ModuleBase>();
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