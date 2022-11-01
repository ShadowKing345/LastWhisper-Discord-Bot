export class Days {
    monday = null;
    tuesday = null;
    wednesday = null;
    thursday = null;
    friday = null;
    saturday = null;
    sunday = null;
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
}
//# sourceMappingURL=days.model.js.map