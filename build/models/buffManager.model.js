export class Buff {
}
export class Days {
    get toArray() {
        return [this.sunday, this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday];
    }
}
export class Week {
    constructor() {
        this.days = new Days();
    }
}
export class MessageSettings {
}
export class BuffManagerConfig {
    constructor() {
        this.messageSettings = new MessageSettings();
        this.buffs = [];
        this.weeks = [];
    }
}
//# sourceMappingURL=buffManager.model.js.map