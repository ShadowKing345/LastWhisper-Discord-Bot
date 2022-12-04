import { Buff } from "./buff.js";
import { Week } from "./week.js";
import { BuffManagerConfig } from "./buffManagerConfig.js";
import { WeekDays } from "./weekDays.js";
export declare class WeekDTO {
    isEnabled: boolean;
    title: string;
    days: Map<WeekDays, Buff | null>;
    static map(week: Week, _: BuffManagerConfig): WeekDTO;
}
//# sourceMappingURL=weekDTO.d.ts.map