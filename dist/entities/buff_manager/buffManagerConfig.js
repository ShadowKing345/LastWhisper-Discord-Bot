import { __decorate, __metadata } from "tslib";
import { Buff } from "./buff.js";
import { MessageSettings } from "./messageSettings.js";
import { Week } from "./week.js";
import { PrimaryGeneratedColumn, Column, OneToMany, Entity, OneToOne, BaseEntity, AfterLoad, AfterInsert, AfterUpdate } from "typeorm";
let BuffManagerConfig = class BuffManagerConfig extends BaseEntity {
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
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], BuffManagerConfig.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], BuffManagerConfig.prototype, "guildId", void 0);
__decorate([
    OneToOne(() => MessageSettings, settings => settings.guildConfig, {
        cascade: true,
        orphanedRowAction: "delete",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", MessageSettings)
], BuffManagerConfig.prototype, "messageSettings", void 0);
__decorate([
    OneToMany(() => Buff, buff => buff.guildConfig, { cascade: true, orphanedRowAction: "delete", onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], BuffManagerConfig.prototype, "buffs", void 0);
__decorate([
    OneToMany(() => Week, week => week.guildConfig, { cascade: true, orphanedRowAction: "delete", onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], BuffManagerConfig.prototype, "weeks", void 0);
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