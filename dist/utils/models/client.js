import { Client as DiscordClient, GatewayIntentBits, Collection } from "discord.js";
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