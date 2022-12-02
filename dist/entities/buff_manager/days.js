import { __decorate, __metadata } from "tslib";
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Buff } from "./buff.js";
let Days = class Days {
    id;
    monday;
    tuesday;
    wednesday;
    thursday;
    friday;
    saturday;
    sunday;
    current = 0;
    get array() {
        return [this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday, this.sunday];
    }
    [Symbol.iterator]() {
        this.current = 0;
        return this;
    }
    next() {
        if (this.current < 7) {
            return { done: false, value: this.array[this.current++] };
        }
        return { done: true, value: null };
    }
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], Days.prototype, "id", void 0);
__decorate([
    OneToOne(() => Buff),
    JoinColumn({ name: "monday_id" }),
    __metadata("design:type", Buff)
], Days.prototype, "monday", void 0);
__decorate([
    OneToOne(() => Buff),
    JoinColumn({ name: "tuesday_id" }),
    __metadata("design:type", Buff)
], Days.prototype, "tuesday", void 0);
__decorate([
    OneToOne(() => Buff),
    JoinColumn({ name: "wednesday_id" }),
    __metadata("design:type", Buff)
], Days.prototype, "wednesday", void 0);
__decorate([
    OneToOne(() => Buff),
    JoinColumn({ name: "thursday_id" }),
    __metadata("design:type", Buff)
], Days.prototype, "thursday", void 0);
__decorate([
    OneToOne(() => Buff),
    JoinColumn({ name: "friday_id" }),
    __metadata("design:type", Buff)
], Days.prototype, "friday", void 0);
__decorate([
    OneToOne(() => Buff),
    JoinColumn({ name: "saturday_id" }),
    __metadata("design:type", Buff)
], Days.prototype, "saturday", void 0);
__decorate([
    OneToOne(() => Buff),
    JoinColumn({ name: "sunday_id" }),
    __metadata("design:type", Buff)
], Days.prototype, "sunday", void 0);
Days = __decorate([
    Entity()
], Days);
export { Days };
//# sourceMappingURL=days.js.map