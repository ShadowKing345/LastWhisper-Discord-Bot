import { Client, Message, Snowflake, TextChannel, Channel } from "discord.js";
import { ToJsonBase } from "./objects/toJsonBase.js";
import { MergeableObjectBase } from "./objects/mergeableObjectBase.js";

/**
 * Fetches the messages from a channel.
 * Returns all the fetched messages.
 * @param client The discord client.
 * @param channelId The channel ID to look for.
 * @param messageIds A collection of messages by their IDs to fetch.
 */
export async function fetchMessages(client: Client, channelId: Snowflake, messageIds: Snowflake[]): Promise<Message[]> {
  const promises: Promise<Message>[] = [];

  const channel: Channel = await client.channels.fetch(channelId);
  if (!(channel && channel instanceof TextChannel)) return [];

  for (const id of messageIds) {
    promises.push(channel.messages.fetch(id));
  }

  const allSettled = await Promise.allSettled(promises);
  const results: Message[] = [];

  for (const result of allSettled) {
    if (result.status === "fulfilled") {
      results.push(result.value);
    }
  }

  return results;
}

/**
 * Wrapper function for JSON string conversation.
 * Object returned will be the assigned object.
 * If object extends type ToJsonBase then the fromJson function will be called.
 * @param t Object to be assigned to.
 * @param str Json string.
 * @return Newly created object.
 */
export function toJson<T>(t: T, str: string): T {
  if (t instanceof ToJsonBase) {
    return (t as ToJsonBase<T>).fromJson(str);
  }

  return Object.assign<T, T>(t, JSON.parse(str) as T);
}

/**
 * Performs a deep merge on an object.
 * If the object extends SanitizeObjectBase then the sanitize function will be called.
 * @param target Target object.
 * @param sources All sources to merge from.
 * @return The newly created object.
 */
export function deepMerge<T, O>(target: T, ...sources: O[]): T {
  sources = sources.filter((source) => source != null);

  if (sources.length <= 0) return target;

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
        } else {
          if (target[kValue] instanceof Object) {
            deepMerge(target[kValue], source[key]);
          } else {
            target[kValue] = source[key];
          }
        }
      }
    }
  }

  return target;
}

/**
 * Flattens an object down to a depth of 1.
 * @param obj Object to be flattened
 */
export function flattenObject(obj: object): object {
  const result = new Map<string, unknown>();

  for (const [ k, v ] of Object.entries(obj)) {
    if (v instanceof Object && !Array.isArray(v)) {
      for (const [ k1, v1 ] of Object.entries(flattenObject(v as object))) {
        result.set(`${k}.${k1}`, v1);
      }

      continue;
    }

    result.set(k, v);
  }

  return Object.fromEntries(result);
}

/**
 * Does the opposite of flattenObject
 * @see flattenObject
 */
export function unFlattenObject(obj: object): object {
  const result = {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
  Object.keys(obj).forEach(key => key.split(".").reduce((r, e, j, array) => r[e] || (r[e] = isNaN(Number(array[j + 1])) ? (array.length - 1 == j ? obj[key] : {}) : []), result));
  console.log(result);
  return result;
}
