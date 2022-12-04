import { BaseEntity, Relation } from "typeorm";
import { EventManagerConfig } from "./eventManagerConfig.js";
export declare class EventObj extends BaseEntity {
    id: string;
    name: string;
    description: string;
    dateTime: number;
    additional: [string, string][];
    guildConfig: Relation<EventManagerConfig>;
    constructor();
    get isValid(): boolean;
}
//# sourceMappingURL=eventObj.d.ts.map