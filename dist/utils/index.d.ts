import { Client, Message, Snowflake } from "discord.js";
export declare function fetchMessages(client: Client, channelId: Snowflake, messageIds: Snowflake[]): Promise<Message[]>;
export declare function deepMerge<T, O>(target: T | {
    new (): T;
}, ...sources: O[]): T;
export declare function flattenObject(obj: object, includeOriginal?: boolean): object;
export declare function unFlattenObject(obj: object): object;
export declare function isRejectedPromise(obj: unknown): obj is PromiseRejectedResult;
//# sourceMappingURL=index.d.ts.map