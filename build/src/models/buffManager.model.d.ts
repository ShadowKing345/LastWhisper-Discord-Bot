import { BasicModel } from "./basicModel.js";
export declare class Buff {
    id: string;
    text: string;
    imageUrl: string;
}
export declare class Days {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    static toArray(days: Days): string[];
}
export declare class Week {
    isEnabled: boolean;
    title: string;
    days: Days;
}
export declare class MessageSettings {
    channelId: string;
    hour: string;
    dow: number | null;
    buffMessage: string;
    weekMessage: string;
}
export declare class BuffManagerConfig extends BasicModel {
    guildId: string;
    messageSettings: MessageSettings;
    buffs: Buff[];
    weeks: Week[];
}
//# sourceMappingURL=buffManager.model.d.ts.map