import { TextChannel } from "discord.js";
import { IMerge } from "./IMerge.js";
export async function fetchMessages(client, channelId, messageIds) {
    const promises = [];
    const channel = await client.channels.fetch(channelId);
    if (!(channel && channel instanceof TextChannel))
        return [];
    for (const id of messageIds) {
        promises.push(channel.messages.fetch(id));
    }
    const allSettled = await Promise.allSettled(promises);
    const results = [];
    for (const result of allSettled) {
        if (result.status === "fulfilled") {
            results.push(result.value);
        }
    }
    return results;
}
export function deepMerge(target, ...sources) {
    const result = typeof target === "function" ? Reflect.construct(target, []) : target;
    sources = sources.filter(source => source != null);
    if (sources.length <= 0)
        return result;
    if (result instanceof (IMerge)) {
        let t = result;
        for (const source of sources) {
            t = t.merge(source);
        }
        return t;
    }
    for (const source of sources) {
        for (const key in source) {
            const kValue = key.valueOf();
            if (source[key]) {
                if (!result[kValue]) {
                    result[kValue] = source[key];
                }
                else {
                    if (result[kValue] instanceof Object) {
                        deepMerge(result[kValue], source[key]);
                    }
                    else {
                        result[kValue] = source[key];
                    }
                }
            }
        }
    }
    return result;
}
export function flattenObject(obj, includeOriginal = false) {
    const result = new Map();
    for (const [k, v] of Object.entries(obj)) {
        if (v instanceof Object && !Array.isArray(v)) {
            for (const [k1, v1] of Object.entries(flattenObject(v, includeOriginal))) {
                result.set(`${k}.${k1}`, v1);
            }
            if (!includeOriginal) {
                continue;
            }
        }
        result.set(k, v);
    }
    return Object.fromEntries(result);
}
export function unFlattenObject(obj) {
    const result = {};
    Object.keys(obj).forEach(key => key.split(".").reduce((r, e, j, array) => r[e] || (r[e] = isNaN(Number(array[j + 1])) ? (array.length - 1 == j ? obj[key] : {}) : []), result));
    console.log(result);
    return result;
}
export function isPromiseRejected(obj) {
    if (!isObject(obj)) {
        return false;
    }
    return "status" in obj && obj.status === "rejected";
}
export function isObject(obj) {
    return typeof obj === "object" && !Array.isArray(obj);
}
export function isArray(obj) {
    return typeof obj === "object" && Array.isArray(obj);
}
//# sourceMappingURL=index.js.map