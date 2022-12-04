import { Relation, BaseEntity } from "typeorm";
import { EventManagerConfig } from "./eventManagerConfig.js";
export declare class Tags extends BaseEntity {
    id: string;
    announcement: string;
    description: string;
    dateTime: string;
    exclusionList: string[];
    guildConfig: Relation<EventManagerConfig>;
    constructor(announcement?: string, description?: string, dateTime?: string, exclusionList?: string[]);
}
//# sourceMappingURL=tags.d.ts.map