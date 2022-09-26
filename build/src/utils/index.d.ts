import { Client, Message, Snowflake } from "discord.js";
export declare function fetchMessages(client: Client, channelId: Snowflake, messageIds: Snowflake[]): Promise<Message[]>;
/**
 * Wrapper function for JSON string conversation.
 * Object returned will be the assigned object.
 * If object extends type ToJsonBase then the fromJson function will be called.
 * @param t Object to be assigned to.
 * @param str Json string.
 * @return Newly created object.
 */
export declare function toJson<T>(t: T, str: string): T;
/**
 * Performs a deep merge on an object.
 * If the object extends SanitizeObjectBase then the sanitize function will be called.
 * @param target Target object.
 * @param sources All sources to merge from.
 * @return The newly created object.
 */
export declare function deepMerge<T, O>(target: T, ...sources: O[]): T;
//# sourceMappingURL=index.d.ts.map