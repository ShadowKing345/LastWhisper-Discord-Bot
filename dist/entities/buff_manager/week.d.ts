import { Days } from "./days.js";
import { MergeObjectBase } from "../../utils/objects/mergeObjectBase.js";
import { DateTime } from "luxon";
import { Relation } from "typeorm";
import { BuffManagerConfig } from "./buffManagerConfig.js";
export declare class Week extends MergeObjectBase<Week> {
    id: string;
    isEnabled: boolean;
    title: string;
    days: Days;
    guildConfig: Relation<BuffManagerConfig>;
    getBuffId(date: DateTime): string;
    merge(obj: Week): Week;
}
//# sourceMappingURL=week.d.ts.map