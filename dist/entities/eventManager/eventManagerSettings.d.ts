import { EntityBase } from "../entityBase.js";
export declare class EventManagerSettings extends EntityBase {
    listenerChannelId: string;
    postingChannelId: string;
    delimiterCharacters: [string, string];
    announcement: string;
    description: string;
    dateTime: string;
    exclusionList: string[];
    dateTimeFormat: string[];
    constructor(guildId?: string, announcement?: string, description?: string, dateTime?: string, exclusionList?: string[]);
}
//# sourceMappingURL=eventManagerSettings.d.ts.map