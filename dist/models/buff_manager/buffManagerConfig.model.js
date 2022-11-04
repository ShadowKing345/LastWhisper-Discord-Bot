import { Buff } from "./buff.model.js";
import { MessageSettings } from "./messageSettings.model.js";
import { Week } from "./week.model.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { deepMerge } from "../../utils/index.js";
export class BuffManagerConfig extends ToJsonBase {
    _id;
    guildId = null;
    messageSettings = new MessageSettings();
    buffs = [];
    weeks = [];
    getWeekOfYear(date) {
        const filteredWeeks = this.getFilteredWeeks;
        return filteredWeeks[date.weekNumber % filteredWeeks.length];
    }
    get getFilteredWeeks() {
        return this.weeks.filter(week => week.isEnabled);
    }
    getBuff(buffId) {
        return this.buffs.find(buff => buff.id === buffId);
    }
    merge(obj) {
        if (obj._id) {
            this._id = obj._id;
        }
        if (obj.guildId) {
            this.guildId = obj.guildId;
        }
        if (obj.messageSettings) {
            this.messageSettings = deepMerge(this.messageSettings ?? new MessageSettings(), this.messageSettings);
        }
        if (obj.buffs) {
            this.buffs = obj.buffs;
            this.buffs = (this.buffs ?? []).map((buff) => deepMerge(new Buff(), buff));
        }
        if (obj.weeks) {
            this.weeks = obj.weeks;
            this.weeks = (this.weeks ?? []).map((week) => deepMerge(new Week(), week));
        }
        return this;
    }
}
//# sourceMappingURL=buffManagerConfig.model.js.map