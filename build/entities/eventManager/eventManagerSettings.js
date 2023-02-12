import { __decorate, __metadata } from "tslib";
import { Entity, Column } from "typeorm";
import { EntityBase } from "../entityBase.js";
let EventManagerSettings = class EventManagerSettings extends EntityBase {
    listenerChannelId = null;
    postingChannelId = null;
    delimiterCharacters = ["[", "]"];
    announcement = null;
    description = null;
    dateTime = null;
    exclusionList = [];
    dateTimeFormat = [];
    constructor(guildId = null, announcement = "Event Announcement", description = "Event Description", dateTime = "Time", exclusionList = []) {
        super();
        this.guildId = guildId;
        this.announcement = announcement;
        this.description = description;
        this.dateTime = dateTime;
        this.exclusionList = exclusionList;
    }
};
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], EventManagerSettings.prototype, "listenerChannelId", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], EventManagerSettings.prototype, "postingChannelId", void 0);
__decorate([
    Column("character", { array: true }),
    __metadata("design:type", Array)
], EventManagerSettings.prototype, "delimiterCharacters", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], EventManagerSettings.prototype, "announcement", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], EventManagerSettings.prototype, "description", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], EventManagerSettings.prototype, "dateTime", void 0);
__decorate([
    Column("text", { array: true }),
    __metadata("design:type", Array)
], EventManagerSettings.prototype, "exclusionList", void 0);
__decorate([
    Column("text", { array: true }),
    __metadata("design:type", Array)
], EventManagerSettings.prototype, "dateTimeFormat", void 0);
EventManagerSettings = __decorate([
    Entity(),
    __metadata("design:paramtypes", [String, Object, Object, Object, Array])
], EventManagerSettings);
export { EventManagerSettings };
//# sourceMappingURL=eventManagerSettings.js.map