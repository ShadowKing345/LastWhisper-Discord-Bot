import { Days } from "./days.js";
import { DateTime } from "luxon";
import { Relation, BaseEntity } from "typeorm";
import { BuffManagerConfig } from "./buffManagerConfig.js";
export declare class Week extends BaseEntity {
    id: string;
    isEnabled: boolean;
    title: string;
    days: Days;
    guildConfig: Relation<BuffManagerConfig>;
    getBuffId(date: DateTime): string;
    merge(obj: Week): Week;
}
//# sourceMappingURL=week.d.ts.map