import { Client, Message, Snowflake } from "discord.js";
import { Days } from "../models/buffManager.model.js";
declare function fetchMessages(client: Client, guildId: Snowflake, channelId: Snowflake, messageIds: Snowflake[]): Promise<Message[]>;
declare function DaysToArray(days: Days): string[];
export { fetchMessages, DaysToArray };
