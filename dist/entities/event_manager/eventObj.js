import { __decorate, __metadata } from "tslib";
import { DateTime } from "luxon";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { EventManagerConfig } from "./eventManagerConfig.js";
let EventObj = class EventObj extends BaseEntity {
    id;
    name = null;
    description = null;
    dateTime = null;
    additional = [];
    guildConfig;
    constructor() {
        super();
    }
    get isValid() {
        return (this.name != "" &&
            this.description != "" &&
            this.dateTime != null &&
            this.dateTime > DateTime.now().toUnixInteger());
    }
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], EventObj.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], EventObj.prototype, "name", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], EventObj.prototype, "description", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], EventObj.prototype, "dateTime", void 0);
__decorate([
    Column("text", { array: true }),
    __metadata("design:type", Array)
], EventObj.prototype, "additional", void 0);
__decorate([
    ManyToOne(() => EventManagerConfig, config => config.events),
    JoinColumn({ name: "config_id" }),
    __metadata("design:type", Object)
], EventObj.prototype, "guildConfig", void 0);
EventObj = __decorate([
    Entity(),
    __metadata("design:paramtypes", [])
], EventObj);
export { EventObj };
//# sourceMappingURL=eventObj.js.map