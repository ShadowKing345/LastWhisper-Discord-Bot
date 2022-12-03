import { TextChannel } from "discord.js";
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
export function toJson(t, str) {
    return Object.assign(t, JSON.parse(str));
}
export function deepMerge(target, ...sources) {
    sources = sources.filter(source => source != null);
    if (sources.length <= 0)
        return target;
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
    return Object.fromEntries(result);
}
export function unFlattenObject(obj) {
    const result = {};
    Object.keys(obj).forEach(key => key.split(".").reduce((r, e, j, array) => r[e] || (r[e] = isNaN(Number(array[j + 1])) ? (array.length - 1 == j ? obj[key] : {}) : []), result));
    console.log(result);
    return result;
}
//# sourceMappingURL=index.js.map