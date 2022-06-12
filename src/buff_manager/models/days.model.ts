export class Days {
    public monday: string;
    public tuesday: string;
    public wednesday: string;
    public thursday: string;
    public friday: string;
    public saturday: string;
    public sunday: string;

    public static toArray(days: Days): string[] {
        return [ days.sunday, days.monday, days.tuesday, days.wednesday, days.thursday, days.friday, days.saturday ];
    }
}