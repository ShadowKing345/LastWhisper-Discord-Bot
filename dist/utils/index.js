import { TextChannel } from "discord.js";
import { ToJsonBase } from "./objects/toJsonBase.js";
import { MergeableObjectBase } from "./objects/mergeableObjectBase.js";
export async function fetchMessages(client, channelId, messageIds) {
    const result = [];
    if (!client.channels.cache.has(channelId))
        return result;
    const channel = await client.channels.fetch(channelId);
    if (!channel || !(channel instanceof TextChannel))
        return result;
    for (const id of messageIds) {
        const message = await channel.messages.fetch(id);
        if (message)
            result.push(message);
    }
    return result;
}
export function toJson(t, str) {
    if (t instanceof ToJsonBase) {
        return t.fromJson(str);
    }
    return Object.assign(t, JSON.parse(str));
}
export function deepMerge(target, ...sources) {
    sources = sources.filter((source) => source != null);
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
            const kValue = key.valueOf();
            if (source[key]) {
                if (!target[kValue]) {
                    target[kValue] = source[key];
                }
                else {
                    if (target[kValue] instanceof Object) {
                        deepMerge(target[kValue], source[key]);
                    }
                    else {
                        target[kValue] = source[key];
                    }
                }
            }
        }
    }
    return target;
}
export function flattenObject(obj) {
    const result = new Map();
    for (const [k, v] of Object.entries(obj)) {
        if (v instanceof Object && !Array.isArray(v)) {
            for (const [k1, v1] of Object.entries(flattenObject(v))) {
                result.set(`${k}.${k1}`, v1);
            }
            continue;
        }
        result.set(k, v);
    }
    return Object.assign({}, ...result.entries());
}
export function unFlattenObject(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        key
            .split(".")
            .reduce((prev, current, index, { length }) => (prev[current] ||
            Object.assign(prev[current], length - 1 === index ? value : {})), result);
    }
    return result;
}
//# sourceMappingURL=index.js.map