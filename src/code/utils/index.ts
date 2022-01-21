import {Channel, Client, Guild, Message, Snowflake, TextChannel} from "discord.js";
import {Days} from "../objects/BuffManager";

async function fetchMessages(client: Client, guildId: Snowflake, channelId: Snowflake, messageIds: Snowflake[]): Promise<Message[]> {
    const result: Message[] = [];

    if (!client.guilds.cache.has(guildId)) return;
    const guild: Guild | null = await client.guilds.fetch(guildId);
    if (!guild) return result;

    if (!client.channels.cache.has(channelId)) return;
    const channel: Channel | null = await guild.channels.fetch(channelId);
    if (!channel) return result;

    for (const id of messageIds) {
        const message: Message | null = await (channel as TextChannel).messages.fetch(id);
        if (message)
            result.push(message);
    }

    return result;
}

function DaysToArray(days: Days): string[] {
    return [days.sunday, days.monday, days.tuesday, days.wednesday, days.thursday, days.friday, days.saturday]
}

export {fetchMessages, DaysToArray}
