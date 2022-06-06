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
    static toArray(days) {
        return [days.sunday, days.monday, days.tuesday, days.wednesday, days.thursday, days.friday, days.saturday];
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