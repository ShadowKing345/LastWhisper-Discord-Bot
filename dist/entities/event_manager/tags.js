import { __decorate, __metadata } from "tslib";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";
import { EventManagerConfig } from "./eventManagerConfig.js";
let Tags = class Tags extends BaseEntity {
    id;
    announcement = null;
    description = null;
    dateTime = null;
    exclusionList = [];
    guildConfig;
    constructor(announcement = "Event Announcement", description = "Event Description", dateTime = "Time", exclusionList = []) {
        super();
        this.announcement = announcement;
        this.description = description;
        this.dateTime = dateTime;
        this.exclusionList = exclusionList;
    }
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Tags.prototype, "id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Tags.prototype, "announcement", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Tags.prototype, "description", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Tags.prototype, "dateTime", void 0);
__decorate([
    Column("character", { array: true }),
    __metadata("design:type", Array)
], Tags.prototype, "exclusionList", void 0);
__decorate([
    OneToOne(() => EventManagerConfig, config => config.tags),
    JoinColumn({ name: "config_id" }),
    __metadata("design:type", Object)
], Tags.prototype, "guildConfig", void 0);
Tags = __decorate([
    Entity(),
    __metadata("design:paramtypes", [Object, Object, Object, Array])
], Tags);
export { Tags };
//# sourceMappingURL=tags.js.map