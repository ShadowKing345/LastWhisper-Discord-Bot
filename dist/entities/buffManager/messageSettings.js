import { __decorate, __metadata } from "tslib";
import { Entity, Column } from "typeorm";
import { EntityBase } from "../entityBase.js";
let MessageSettings = class MessageSettings extends EntityBase {
    channelId = null;
    hour = null;
    dow = null;
    buffMessage = null;
    weekMessage = null;
};
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], MessageSettings.prototype, "channelId", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], MessageSettings.prototype, "hour", void 0);
__decorate([
    Column({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], MessageSettings.prototype, "dow", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], MessageSettings.prototype, "buffMessage", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], MessageSettings.prototype, "weekMessage", void 0);
MessageSettings = __decorate([
    Entity()
], MessageSettings);
export { MessageSettings };
//# sourceMappingURL=messageSettings.js.map