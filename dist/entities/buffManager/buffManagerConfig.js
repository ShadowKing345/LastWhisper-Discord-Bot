import { __decorate, __metadata } from "tslib";
import { MessageSettings } from "./messageSettings.js";
import { Entity, AfterLoad, AfterInsert, AfterUpdate } from "typeorm";
import { EntityBase } from "../entityBase.js";
let BuffManagerConfig = class BuffManagerConfig extends EntityBase {
    messageSettings = new MessageSettings();
    buffs;
    weeks;
    getWeekOfYear(date) {
        const filteredWeeks = this.getFilteredWeeks;
        return filteredWeeks[date.weekNumber % filteredWeeks.length];
    }
    get getFilteredWeeks() {
        return this.weeks?.filter(week => week.isEnabled) ?? [];
    }
    getBuff(buffId) {
        return this.buffs?.find(buff => buff.id === buffId);
    }
    nullChecks() {
        if (!this.buffs) {
            this.buffs = [];
        }
        if (!this.weeks) {
            this.weeks = [];
        }
    }
};
__decorate([
    AfterLoad(),
    AfterInsert(),
    AfterUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuffManagerConfig.prototype, "nullChecks", null);
BuffManagerConfig = __decorate([
    Entity()
], BuffManagerConfig);
export { BuffManagerConfig };
//# sourceMappingURL=buffManagerConfig.js.map