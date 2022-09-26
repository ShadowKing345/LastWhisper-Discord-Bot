import { Buff } from "./buff.model.js";
import { MessageSettings } from "./messageSettings.model.js";
import { Week } from "./week.model.js";
import { IEntity } from "../../utils/objects/repositoryBase.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { deepMerge } from "../../utils/index.js";

/**
 * Buff Manager Configuration Object.
 */
export class BuffManagerConfig extends ToJsonBase<BuffManagerConfig> implements IEntity {
    public _id;
    public guildId: string;
    public messageSettings: MessageSettings = new MessageSettings();
    public buffs: Buff[] = [];
    public weeks: Week[] = [];

    public merge(obj: BuffManagerConfig): BuffManagerConfig {
        if (obj._id) {
            this._id = obj._id;
        }

        if (obj.guildId) {
            this.guildId = obj.guildId;
        }

        if (obj.messageSettings) {
            this.messageSettings = deepMerge(this.messageSettings ?? new MessageSettings, this.messageSettings);
        }

        if (obj.buffs) {
            this.buffs = (this.buffs ?? []).map(buff => deepMerge(new Buff, buff));
        }

        if (obj.weeks) {
            this.weeks = (this.weeks ?? []).map(week => deepMerge(new Week, week));
        }

        return this;
    }
}
