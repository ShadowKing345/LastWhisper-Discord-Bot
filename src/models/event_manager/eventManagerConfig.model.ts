import { IEntity } from "../../utils/objects/repositoryBase.js";
import { EventObj } from "./eventObj.model.js";
import { Reminder } from "./reminderTrigger.model.js";
import { Tags } from "./tags.model.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { deepMerge } from "../../utils/index.js";

/**
 * Event manager configuration object.
 */
export class EventManagerConfig extends ToJsonBase<EventManagerConfig> implements IEntity<string> {
  public _id: string;
  public guildId: string = null;
  public listenerChannelId: string | null = null;
  public postingChannelId: string | null = null;
  public delimiterCharacters: [string, string] = ["[", "]"];
  public tags: Tags = new Tags();
  public dateTimeFormat: string[] = [];
  public events: EventObj[] = [];
  public reminders: Reminder[] = [];

  public getEventByIndex(index: number): EventObj {
    return this.events[index % this.events.length];
  }

  public merge(obj: Partial<EventManagerConfig>): EventManagerConfig {
    if (obj._id) {
      this._id = obj._id;
    }

    if (obj.guildId) {
      this.guildId = obj.guildId;
    }

    if (obj.listenerChannelId) {
      this.listenerChannelId = obj.listenerChannelId;
    }

    if (obj.postingChannelId) {
      this.postingChannelId = obj.postingChannelId;
    }

    if (obj.delimiterCharacters) {
      this.delimiterCharacters = obj.delimiterCharacters;
    }

    if (obj.tags) {
      this.tags = deepMerge(this.tags ?? new Tags(), obj.tags);
    }

    if (obj.dateTimeFormat) {
      this.dateTimeFormat = obj.dateTimeFormat;
    }

    if (obj.events) {
      this.events = obj.events.map((event) => deepMerge(new EventObj(), event));
    }

    if (obj.reminders) {
      this.reminders = obj.reminders.map((reminder) => deepMerge(new Reminder(), reminder));
    }

    return this;
  }
}
