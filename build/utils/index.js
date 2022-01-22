"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaysToArray = exports.fetchMessages = void 0;
async function fetchMessages(client, guildId, channelId, messageIds) {
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
exports.fetchMessages = fetchMessages;
function DaysToArray(days) {
    return [days.sunday, days.monday, days.tuesday, days.wednesday, days.thursday, days.friday, days.saturday];
}
exports.DaysToArray = DaysToArray;
