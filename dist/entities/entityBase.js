import { __decorate, __metadata } from "tslib";
import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";
export class EntityBase extends BaseEntity {
    id;
    guildId = null;
}
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], EntityBase.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], EntityBase.prototype, "guildId", void 0);
//# sourceMappingURL=entityBase.js.map