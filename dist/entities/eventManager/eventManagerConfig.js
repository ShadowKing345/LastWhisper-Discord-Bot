import { __decorate, __metadata } from "tslib";
import { EventObject } from "./eventObject.js";
import { EventReminder } from "./eventReminder.js";
import { Entity, Column, OneToMany, AfterLoad, AfterInsert, AfterUpdate } from "typeorm";
import { EntityBase } from "../entityBase.js";
let EventManagerConfig = class EventManagerConfig extends EntityBase {
    listenerChannelId = null;
    postingChannelId = null;
    delimiterCharacters = ["[", "]"];
    announcement = null;
    description = null;
    dateTime = null;
    exclusionList = [];
    dateTimeFormat = [];
    events;
    reminders;
    constructor(announcement = "Event Announcement", description = "Event Description", dateTime = "Time", exclusionList = []) {
        super();
        this.announcement = announcement;
        this.description = description;
        this.dateTime = dateTime;
        this.exclusionList = exclusionList;
    }
    getEventByIndex(index) {
        return this.events[index % this.events.length];
    }
    nullChecks() {
        if (!this.delimiterCharacters) {
            this.delimiterCharacters = ["[", "]"];
        }
        if (!this.dateTimeFormat) {
            this.dateTimeFormat = [];
        }
        if (!this.events) {
            this.events = [];
        }
        if (!this.reminders) {
            this.reminders = [];
        }
    }
};
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], EventManagerConfig.prototype, "listenerChannelId", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], EventManagerConfig.prototype, "postingChannelId", void 0);
__decorate([
    Column("character", { array: true }),
    __metadata("design:type", Array)
], EventManagerConfig.prototype, "delimiterCharacters", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], EventManagerConfig.prototype, "announcement", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], EventManagerConfig.prototype, "description", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], EventManagerConfig.prototype, "dateTime", void 0);
__decorate([
    Column("character", { array: true }),
    __metadata("design:type", Array)
], EventManagerConfig.prototype, "exclusionList", void 0);
__decorate([
    Column("text", { array: true }),
    __metadata("design:type", Array)
], EventManagerConfig.prototype, "dateTimeFormat", void 0);
__decorate([
    OneToMany(() => EventObject, obj => obj.guildConfig, {
        cascade: true,
        orphanedRowAction: "delete",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], EventManagerConfig.prototype, "events", void 0);
__decorate([
    OneToMany(() => EventReminder, obj => obj.guildConfig, {
        cascade: true,
        orphanedRowAction: "delete",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], EventManagerConfig.prototype, "reminders", void 0);
__decorate([
    AfterLoad(),
    AfterInsert(),
    AfterUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventManagerConfig.prototype, "nullChecks", null);
EventManagerConfig = __decorate([
    Entity(),
    __metadata("design:paramtypes", [Object, Object, Object, Array])
], EventManagerConfig);
export { EventManagerConfig };
//# sourceMappingURL=eventManagerConfig.js.map