export async function fetchMessages(client, guildId, channelId, messageIds) {
    const result = [];
    if (!client.guilds.cache.has(guildId))
        return;
    const guild = await client.guilds.fetch(guildId);
    if (!guild)
        return result;
    if (!client.channels.cache.has(channelId))
        return;
    const channel = await guild.channels.fetch(channelId);
    if (!channel)
        return result;
    for (const id of messageIds) {
        const message = await channel.messages.fetch(id);
        if (message)
            result.push(message);
    }
    return result;
}
export function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    for (const source of sources) {
        if (target && source) {
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
    }
    return target;
}
//# sourceMappingURL=utils.js.map