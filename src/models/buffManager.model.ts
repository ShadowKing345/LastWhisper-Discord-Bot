import { BasicModel } from "./basicModel.js";

export class Buff {
    public id: string;
    public text: string;
    public imageUrl: string;
}

export class Days {
    public monday: string;
    public tuesday: string;
    public wednesday: string;
    public thursday: string;
    public friday: string;
    public saturday: string;
    public sunday: string;

    public static toArray(days: Days): string[] {
        return [ days.sunday, days.monday, days.tuesday, days.wednesday, days.thursday, days.friday, days.saturday ];
    }
}

export class Week {
    public isEnabled: boolean;
    public title: string;
    public days: Days = new Days();
}

export class MessageSettings {
    public channelId: string;
    public hour: string;
    public dow: number | null;
    public buffMessage: string;
    public weekMessage: string;
}

export class BuffManagerConfig extends BasicModel {
    public guildId: string;
    public messageSettings: MessageSettings = new MessageSettings();
    public buffs: Buff[] = [];
    public weeks: Week[] = [];
}
