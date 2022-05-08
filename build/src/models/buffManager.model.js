import { BasicModel } from "./basicModel.js";
export class Buff {
    id;
    text;
    imageUrl;
}
export class Days {
    monday;
    tuesday;
    wednesday;
    thursday;
    friday;
    saturday;
    sunday;
    get toArray() {
        return [this.sunday, this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday];
    }
}
export class Week {
    isEnabled;
    title;
    days = new Days();
}
export class MessageSettings {
    channelId;
    hour;
    dow;
    buffMessage;
    weekMessage;
}
export class BuffManagerConfig extends BasicModel {
    guildId;
    messageSettings = new MessageSettings();
    buffs = [];
    weeks = [];
}
//# sourceMappingURL=buffManager.model.js.map