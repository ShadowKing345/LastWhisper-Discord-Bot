import { __decorate, __metadata } from "tslib";
import { Days } from "./days.js";
import { deepMerge } from "../../utils/index.js";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, BaseEntity } from "typeorm";
import { BuffManagerConfig } from "./buffManagerConfig.js";
let Week = class Week extends BaseEntity {
    id;
    isEnabled = false;
    title = null;
    days;
    guildConfig;
    getBuffId(date) {
        return Array(...this.days)[date.weekday - 1].id;
    }
    merge(obj) {
        if (obj.isEnabled) {
            this.isEnabled = obj.isEnabled;
        }
        if (obj.title) {
            this.title = obj.title;
        }
        if (obj.days) {
            this.days = deepMerge(this.days ?? new Days(), obj.days);
        }
        return this;
    }
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Week.prototype, "id", void 0);
__decorate([
    Column({
        type: "boolean"
    }),
    __metadata("design:type", Object)
], Week.prototype, "isEnabled", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Week.prototype, "title", void 0);
__decorate([
    OneToOne(() => Days, { cascade: true, orphanedRowAction: "delete" }),
    JoinColumn({ name: "days_id" }),
    __metadata("design:type", Days)
], Week.prototype, "days", void 0);
__decorate([
    ManyToOne(() => BuffManagerConfig, config => config.weeks),
    JoinColumn({ name: "config_id" }),
    __metadata("design:type", Object)
], Week.prototype, "guildConfig", void 0);
Week = __decorate([
    Entity()
], Week);
export { Week };
//# sourceMappingURL=week.js.map