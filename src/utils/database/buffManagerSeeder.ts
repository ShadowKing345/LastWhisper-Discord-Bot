import { DataSource } from "typeorm";
import { Buff, BuffManagerSettings, Days, Week } from "../../entities/buffManager/index.js";
import { isArray, isObject } from "../index.js";

/**
 * Seeds the database using a json object.
 * @param ds The datasource of the database.
 * @param guildId To provide to the classes.
 * @param data The actual json object to extract information form.
 */
export async function buffManagerSeeder(ds: DataSource, guildId: string, data: unknown): Promise<void> {
  const messageSettings = new BuffManagerSettings();
  messageSettings.guildId = guildId;

  if (isObject(data)) {
    if ("messageSettings" in data && isObject(data.messageSettings)) {
      const ms = data.messageSettings;

      if ("channelId" in ms && typeof ms.channelId === "string") {
        messageSettings.channelId = ms.channelId;
      }

      if ("hour" in ms && typeof ms.hour === "string") {
        messageSettings.hour = ms.hour;
      }

      if ("dow" in ms && typeof ms.dow === "number") {
        messageSettings.dow = ms.dow;
      }

      if ("buffMessage" in ms && typeof ms.buffMessage === "string") {
        messageSettings.buffMessage = ms.buffMessage;
      }

      if ("weekMessage" in ms && typeof ms.weekMessage === "string") {
        messageSettings.weekMessage = ms.weekMessage;
      }
    }

    await ds.getRepository<BuffManagerSettings>(BuffManagerSettings).save(messageSettings);

    const buffKeys: Record<string, Buff> = {};

    if ("buffs" in data && isArray(data.buffs)) {
      const buffRepo = ds.getRepository<Buff>(Buff);

      for (const buff of data.buffs) {
        if (isObject(buff) && "id" in buff && typeof buff.id === "string") {
          if (!(("text" in buff && typeof buff.text === "string") && ("imageUrl" in buff && typeof buff.imageUrl === "string"))) {
            console.log(`Not a valid buff with id ${buff.id}. Skipping.`);
            continue;
          }

          const b = new Buff();
          b.guildId = guildId;
          b.text = buff.text;
          b.imageUrl = buff.imageUrl;

          buffKeys[buff.id] = await buffRepo.save(b);
        }
      }
    }

    if ("weeks" in data && isArray(data.weeks)) {
      const weekRepo = ds.getRepository<Week>(Week);

      for (const week of data.weeks) {
        if (isObject(week) && "title" in week && "days" in week && typeof week.title === "string" && typeof week.days === "object" && !Array.isArray(week.days)) {
          const d = new Days();
          d.guildId = guildId;
          for (const dKey in week.days) {
            if (dKey in d && typeof week.days[dKey] === "string") {
              d[dKey] = buffKeys[week.days[dKey] as string];
            }
          }

          const w = new Week();
          w.guildId = guildId;
          w.title = week.title;
          w.days = d;

          await weekRepo.save(w);
        }
      }
    }
  }
}