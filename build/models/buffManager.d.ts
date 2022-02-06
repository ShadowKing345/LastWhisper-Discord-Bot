export declare class Day {
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
}
export declare class Week {
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
export declare class BuffManagerConfig {
    guildId: string;
    messageSettings: MessageSettings | null;
    days: Day[];
    weeks: Week[];
}
