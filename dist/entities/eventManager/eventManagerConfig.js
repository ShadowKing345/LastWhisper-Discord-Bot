import { __decorate, __metadata } from "tslib";
import { EventObj } from "./eventObj.js";
import { Reminder } from "./reminder.js";
import { Tags } from "./tags.js";
import { Entity, Column, OneToOne, OneToMany, AfterLoad, AfterInsert, AfterUpdate } from "typeorm";
import { EntityBase } from "../entityBase.js";
let EventManagerConfig = class EventManagerConfig extends EntityBase {
    listenerChannelId = null;
    postingChannelId = null;
    delimiterCharacters = ["[", "]"];
    tags = new Tags();
    dateTimeFormat = [];
    events;
    reminders;
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
    OneToOne(() => Tags, tag => tag.guildConfig, { cascade: true, orphanedRowAction: "delete", onDelete: "CASCADE" }),
    __metadata("design:type", Tags)
], EventManagerConfig.prototype, "tags", void 0);
__decorate([
    Column("text", { array: true }),
    __metadata("design:type", Array)
], EventManagerConfig.prototype, "dateTimeFormat", void 0);
__decorate([
    OneToMany(() => EventObj, obj => obj.guildConfig, {
        cascade: true,
        orphanedRowAction: "delete",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], EventManagerConfig.prototype, "events", void 0);
__decorate([
    OneToMany(() => Reminder, obj => obj.guildConfig, {
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
    Entity()
], EventManagerConfig);
export { EventManagerConfig };
//# sourceMappingURL=eventManagerConfig.js.map