import { EventObj } from "./eventObj.js";
import { Reminder } from "./reminder.js";
import { Tags } from "./tags.js";
import { GuildConfigBase } from "../guildConfigBase.js";
export declare class EventManagerConfig extends GuildConfigBase {
    id: string;
    listenerChannelId: string;
    postingChannelId: string;
    delimiterCharacters: [string, string];
    tags: Tags;
    dateTimeFormat: string[];
    events: EventObj[];
    reminders: Reminder[];
    getEventByIndex(index: number): EventObj;
    nullChecks(): void;
}
//# sourceMappingURL=eventManagerConfig.d.ts.map