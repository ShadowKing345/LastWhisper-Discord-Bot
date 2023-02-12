import { isArray, isObject } from "../index.js";
import { EventManagerSettings, EventObject, EventReminder } from "../../entities/eventManager/index.js";
export async function eventManagerSeeder(ds, guildId, data) {
    if (isObject(data)) {
        const eventManagerSettings = new EventManagerSettings();
        eventManagerSettings.guildId = guildId;
        if ("listenerChannelId" in data && typeof data.listenerChannelId === "string") {
            eventManagerSettings.listenerChannelId = data.listenerChannelId;
        }
        if ("postingChannelId" in data && typeof data.postingChannelId === "string") {
            eventManagerSettings.postingChannelId = data.postingChannelId;
        }
        if ("delimiterCharacters" in data && isArray(data.delimiterCharacters)) {
            if (data.delimiterCharacters.length !== 2) {
                console.error(new Error("Delimiter characters have to be of length 2. Using defaults."));
            }
            else {
                eventManagerSettings.delimiterCharacters = data.delimiterCharacters;
            }
        }
        if ("dateTimeFormat" in data && isArray(data.dateTimeFormat)) {
            eventManagerSettings.dateTimeFormat = data.dateTimeFormat;
        }
        if ("tags" in data && isObject(data.tags)) {
            const tags = data.tags;
            if ("announcement" in tags && typeof tags.announcement === "string") {
                eventManagerSettings.announcement = tags.announcement;
            }
            if ("description" in tags && typeof tags.description === "string") {
                eventManagerSettings.description = tags.description;
            }
            if ("dateTime" in tags && typeof tags.dateTime === "string") {
                eventManagerSettings.dateTime = tags.dateTime;
            }
            if ("exclusionList" in tags && isArray(tags.exclusionList)) {
                eventManagerSettings.exclusionList = tags.exclusionList;
            }
        }
        await ds.getRepository(EventManagerSettings).save(eventManagerSettings);
        if ("events" in data && isArray(data.events)) {
            const eventObjectRepository = ds.getRepository(EventObject);
            for (const event of data.events) {
                if (!isObject(event)) {
                    console.error(new Error("Event is not an object. Skipping."));
                    continue;
                }
                const e = new EventObject();
                e.guildId = guildId;
                if ("id" in event && typeof event.id === "string") {
                    e.messageId = event.id;
                }
                if ("name" in event && typeof event.name === "string") {
                    e.name = event.name;
                }
                if ("description" in event && typeof event.description === "string") {
                    e.description = event.description;
                }
                if ("dateTime" in event && typeof event.dateTime === "number") {
                    e.dateTime = event.dateTime;
                }
                if ("additional" in event && isArray(event.additional)) {
                    e.additional = event.additional.filter(value => {
                        if (!isArray(value)) {
                            console.error(new Error("Event additional tags pair is not an array. Skipping."));
                            return false;
                        }
                        if (value.length !== 2) {
                            console.error(new Error("Event additional tags pair is not of length 2. Skipping."));
                            return false;
                        }
                        return true;
                    });
                }
                if (e.isValid) {
                    await eventObjectRepository.save(e);
                }
            }
        }
        if ("reminders" in data && isArray(data.reminders)) {
            const eventReminderRepository = ds.getRepository(EventReminder);
            for (const reminder of data.reminders) {
                if (!isObject(reminder)) {
                    console.error(new Error("Reminder is not an object. skipping."));
                    continue;
                }
                const r = new EventReminder();
                r.guildId = guildId;
                if ("message" in reminder && typeof reminder.message === "string") {
                    r.message = reminder.message;
                }
                if ("timeDelta" in reminder && typeof reminder.timeDelta === "string") {
                    r.timeDelta = reminder.timeDelta;
                }
                await eventReminderRepository.save(r);
            }
        }
    }
}
//# sourceMappingURL=eventManagerSeeder.js.map