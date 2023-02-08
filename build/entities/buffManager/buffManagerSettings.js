import { __decorate, __metadata } from "tslib";
import { Entity, Column } from "typeorm";
import { EntityBase } from "../entityBase.js";
let BuffManagerSettings = class BuffManagerSettings extends EntityBase {
    channelId = null;
    hour = null;
    dow = null;
    buffMessage = null;
    weekMessage = null;
};
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], BuffManagerSettings.prototype, "channelId", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], BuffManagerSettings.prototype, "hour", void 0);
__decorate([
    Column({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], BuffManagerSettings.prototype, "dow", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], BuffManagerSettings.prototype, "buffMessage", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], BuffManagerSettings.prototype, "weekMessage", void 0);
BuffManagerSettings = __decorate([
    Entity()
], BuffManagerSettings);
export { BuffManagerSettings };
//# sourceMappingURL=buffManagerSettings.js.map