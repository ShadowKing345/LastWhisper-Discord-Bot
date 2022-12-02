import { __decorate, __metadata } from "tslib";
import { Buff } from "./buff.js";
import { MessageSettings } from "./messageSettings.js";
import { Week } from "./week.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { deepMerge } from "../../utils/index.js";
import { PrimaryGeneratedColumn, Column, OneToMany, Entity, OneToOne, JoinColumn } from "typeorm";
let BuffManagerConfig = class BuffManagerConfig extends ToJsonBase {
    _id;
    id;
    guildId = null;
    messageSettings = new MessageSettings();
    buffs;
    weeks;
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
            this.buffs = (this.buffs ?? []).map(buff => deepMerge(new Buff(), buff));
        }
        if (obj.weeks) {
            this.weeks = obj.weeks;
            this.weeks = (this.weeks ?? []).map(week => deepMerge(new Week(), week));
        }
        return this;
    }
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], BuffManagerConfig.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], BuffManagerConfig.prototype, "guildId", void 0);
__decorate([
    OneToOne(() => MessageSettings, settings => settings.guildConfig, { cascade: true, orphanedRowAction: "delete" }),
    JoinColumn({ name: "message_settings_id" }),
    __metadata("design:type", MessageSettings)
], BuffManagerConfig.prototype, "messageSettings", void 0);
__decorate([
    OneToMany(() => Buff, buff => buff.guildConfig, { cascade: true, orphanedRowAction: "delete" }),
    __metadata("design:type", Array)
], BuffManagerConfig.prototype, "buffs", void 0);
__decorate([
    OneToMany(() => Week, week => week.guildConfig, { cascade: true, orphanedRowAction: "delete" }),
    __metadata("design:type", Array)
], BuffManagerConfig.prototype, "weeks", void 0);
BuffManagerConfig = __decorate([
    Entity()
], BuffManagerConfig);
export { BuffManagerConfig };
//# sourceMappingURL=buffManagerConfig.js.map