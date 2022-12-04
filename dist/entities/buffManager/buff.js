import { __decorate, __metadata } from "tslib";
import { Entity, Column } from "typeorm";
import { EntityBase } from "../entityBase.js";
let Buff = class Buff extends EntityBase {
    text = null;
    imageUrl = null;
};
__decorate([
    Column(),
    __metadata("design:type", String)
], Buff.prototype, "text", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Buff.prototype, "imageUrl", void 0);
Buff = __decorate([
    Entity()
], Buff);
export { Buff };
//# sourceMappingURL=buff.js.map