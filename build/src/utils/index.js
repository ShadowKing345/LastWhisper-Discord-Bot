import { ToJsonBase } from "./objects/toJsonBase.js";
import { MergeableObjectBase } from "./objects/mergeableObjectBase.js";
export async function fetchMessages(client, channelId, messageIds) {
    const result = [];
    if (!client.channels.cache.has(channelId))
        return result;
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased)
        return result;
    for (const id of messageIds) {
        const message = await channel.messages.fetch(id);
        if (message)
            result.push(message);
    }
    return result;
}
/**
 * Wrapper function for JSON string conversation.
 * Object returned will be the assigned object.
 * If object extends type ToJsonBase then the fromJson function will be called.
 * @param t Object to be assigned to.
 * @param str Json string.
 * @return Newly created object.
 */
export function toJson(t, str) {
    if (t instanceof ToJsonBase) {
        return t.fromJson(str);
    }
    return Object.assign(t, JSON.parse(str));
}
/**
 * Performs a deep merge on an object.
 * If the object extends SanitizeObjectBase then the sanitize function will be called.
 * @param target Target object.
 * @param sources All sources to merge from.
 * @return The newly created object.
 */
export function deepMerge(target, ...sources) {
    sources = sources.filter(source => source != null);
    if (sources.length <= 0)
        return target;
    if (target instanceof MergeableObjectBase) {
        for (const source of sources) {
            target.merge(source);
        }
        return target;
    }
    for (const source of sources) {
        for (const key in source) {
            if (source[key]) {
                if (!target[key.valueOf()]) {
                    target[key.valueOf()] = source[key];
                }
                else {
                    if (typeof target[key.valueOf()] === "object") {
                        deepMerge(target[key.valueOf()], source[key]);
                    }
                    else {
                        target[key.valueOf()] = source[key];
                    }
                }
            }
        }
    }
    return target;
}
//# sourceMappingURL=index.js.map