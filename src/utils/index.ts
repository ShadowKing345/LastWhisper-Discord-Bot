import { Client, Message, Snowflake, TextChannel, Channel } from "discord.js";
import { IMerge } from "./IMerge.js";

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
 * Performs a deep merge on an object.
 * If the object extends SanitizeObjectBase then the sanitize function will be called.
 * @param target Target object.
 * @param sources All sources to merge from.
 * @return The newly created object.
 */
export function deepMerge<T, O>(target: T | { new(): T }, ...sources: O[]): T {
  const result = typeof target === "function" ? Reflect.construct(target, []) as T : target;
  sources = sources.filter(source => source != null);
  if (sources.length <= 0) return result;

  if (result instanceof IMerge<T>) {
    let t = result;
    for (const source of sources) {
      t = (t as IMerge<T>).merge(source) as T & IMerge<T>;
    }
    return t;
  }


  for (const source of sources) {
    for (const key in source) {
      const kValue = key.valueOf();
      if (source[key]) {
        if (!result[kValue]) {
          result[kValue] = source[key];
        } else {
          if (result[kValue] instanceof Object) {
            deepMerge(result[kValue], source[key]);
          } else {
            result[kValue] = source[key];
          }
        }
      }
    }
  }

  return result;
}

/**
 * Flattens an object down to a depth of 1.
 * @param obj Object to be flattened
 * @param includeOriginal Adds the original in the final list.
 */
export function flattenObject(obj: object, includeOriginal = false): object {
  const result = new Map<string, unknown>();

  for (const [ k, v ] of Object.entries(obj)) {
    if (v instanceof Object && !Array.isArray(v)) {
      for (const [ k1, v1 ] of Object.entries(flattenObject(v as object, includeOriginal))) {
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

/**
 * Does the opposite of flattenObject
 * @see flattenObject
 */
export function unFlattenObject(obj: object): object {
  const result = {};
  Object.keys(obj).forEach(key =>
    key.split(".").reduce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
      (r, e, j, array) => r[e] || (r[e] = isNaN(Number(array[j + 1])) ? (array.length - 1 == j ? obj[key] : {}) : []),
      result,
    ),
  );
  console.log(result);
  return result;
}
