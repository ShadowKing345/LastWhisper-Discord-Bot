import {Channel, Client, Guild, Message, TextChannel} from "discord.js";

async function fetchMessages(client: Client, guildId: string, channelId: string, messageIds: string[]): Promise<Message[]> {
    const result: Message[] = [];

    const guild: Guild | null = await client.guilds.fetch(guildId);
    if (!guild) return result;

    const channel: Channel | null = await guild.channels.fetch(channelId);
    if (!channel) return result;

    for (const id of messageIds) {
        const message: Message | null = await (channel as TextChannel).messages.fetch(id);
        if (message)
            result.push(message);
    }

    return result;
}

export {fetchMessages}
