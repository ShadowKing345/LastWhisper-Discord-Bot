import { Client, Message, Snowflake } from "discord.js";
export declare function fetchMessages(client: Client, guildId: Snowflake, channelId: Snowflake, messageIds: Snowflake[]): Promise<Message[]>;
