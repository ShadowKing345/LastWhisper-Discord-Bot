import { Relation } from "typeorm";
import { EventManagerConfig } from "./eventManagerConfig.js";
import { EntityBase } from "../entityBase.js";
export declare class EventObject extends EntityBase {
    name: string;
    description: string;
    dateTime: number;
    additional: [string, string][];
    guildConfig: Relation<EventManagerConfig>;
    constructor();
    get isValid(): boolean;
}
//# sourceMappingURL=eventObject.d.ts.map