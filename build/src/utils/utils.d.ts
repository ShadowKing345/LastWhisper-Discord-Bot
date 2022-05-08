import { Client, Message, Snowflake } from "discord.js";
export declare function fetchMessages(client: Client, guildId: Snowflake, channelId: Snowflake, messageIds: Snowflake[]): Promise<Message[]>;
export declare function deepMerge<T, O>(target: T, ...sources: O[]): T;
//# sourceMappingURL=utils.d.ts.map