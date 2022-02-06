export class Day {
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
}

export class Week {
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

export class BuffManagerConfig {
    public guildId: string;
    public messageSettings: MessageSettings | null = new MessageSettings();
    public days: Day[] = [];
    public weeks: Week[] = [];
}