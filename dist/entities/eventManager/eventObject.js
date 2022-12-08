import { __decorate, __metadata } from "tslib";
import { DateTime } from "luxon";
import { Entity, Column } from "typeorm";
import { EntityBase } from "../entityBase.js";
let EventObject = class EventObject extends EntityBase {
    messageId = null;
    name = null;
    description = null;
    dateTime = null;
    additional = [];
    constructor() {
        super();
    }
    get isValid() {
        return (this.name != "" &&
            this.description != "" &&
            this.dateTime != null &&
            this.dateTime > DateTime.now().toUnixInteger());
    }
    merge(obj) {
        if (obj.messageId) {
            this.messageId = obj.messageId;
        }
        return this;
    }
};
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], EventObject.prototype, "messageId", void 0);
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
EventObject = __decorate([
    Entity(),
    __metadata("design:paramtypes", [])
], EventObject);
export { EventObject };
//# sourceMappingURL=eventObject.js.map