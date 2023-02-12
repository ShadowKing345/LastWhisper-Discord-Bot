import { Client, Message, Snowflake } from "discord.js";
export declare function fetchMessages(client: Client, channelId: Snowflake, messageIds: Snowflake[]): Promise<Message[]>;
export declare function deepMerge<T, O>(target: T | {
    new (): T;
}, ...sources: O[]): T;
export declare function flattenObject(obj: object, includeOriginal?: boolean): object;
export declare function unFlattenObject(obj: object): object;
export declare function isPromiseRejected(obj: unknown): obj is PromiseRejectedResult;
export declare function isObject(obj: unknown): obj is object;
export declare function isArray(obj: unknown): obj is Array<unknown>;
//# sourceMappingURL=index.d.ts.map