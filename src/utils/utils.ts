import { Client, Message, Snowflake, TextChannel } from "discord.js";

export async function fetchMessages(client: Client, channelId: Snowflake, messageIds: Snowflake[]): Promise<Message[]> {
    const result: Message[] = [];

    if (!client.channels.cache.has(channelId)) return result;
    const channel: TextChannel | null = await client.channels.fetch(channelId) as TextChannel;
    if (!channel || !channel.isText) return result;

    for (const id of messageIds) {
        const message: Message | null = await channel.messages.fetch(id);
        if (message) result.push(message);
    }

    return result;
}

export function deepMerge<T, O>(target: T, ...sources: O[]): T {
    if (!sources.length) return target;

    for (const source of sources) {
        if (target && source) {
            for (const key in source) {
                if (source[key]) {
                    if (!target[key.valueOf()]) {
                        target[key.valueOf()] = source[key];
                    } else {
                        if (typeof target[key.valueOf()] === "object") {
                            deepMerge(target[key.valueOf()], source[key]);
                        } else {
                            target[key.valueOf()] = source[key];
                        }
                    }
                }
            }
        }
    }

    return target;
}
