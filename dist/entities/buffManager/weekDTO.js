import { DaysOfWeek } from "./weekDays.js";
export class WeekDTO {
    isEnabled = false;
    title = null;
    days = new Map();
    static map(week, _) {
        const result = new WeekDTO();
        result.isEnabled = week.isEnabled;
        result.title = week.title;
        Array(...week.days).forEach((buffId, index) => result.days.set(DaysOfWeek[index], buffId));
        return result;
    }
}
//# sourceMappingURL=weekDTO.js.map