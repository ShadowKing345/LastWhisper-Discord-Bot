import { __decorate, __metadata } from "tslib";
import { DateTime } from "luxon";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { EventManagerConfig } from "./eventManagerConfig.js";
import { EntityBase } from "../entityBase.js";
let EventObject = class EventObject extends EntityBase {
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
    Column(),
    __metadata("design:type", String)
], EventObject.prototype, "name", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], EventObject.prototype, "description", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], EventObject.prototype, "dateTime", void 0);
__decorate([
    Column("text", { array: true }),
    __metadata("design:type", Array)
], EventObject.prototype, "additional", void 0);
__decorate([
    ManyToOne(() => EventManagerConfig, config => config.events),
    JoinColumn({ name: "config_id" }),
    __metadata("design:type", Object)
], EventObject.prototype, "guildConfig", void 0);
EventObject = __decorate([
    Entity(),
    __metadata("design:paramtypes", [])
], EventObject);
export { EventObject };
//# sourceMappingURL=eventObject.js.map