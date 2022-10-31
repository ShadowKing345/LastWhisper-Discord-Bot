export class Tags {
    announcement = null;
    description = null;
    dateTime = null;
    exclusionList = [];
    constructor(announcement = "Event Announcement", description = "Event Description", dateTime = "Time", exclusionList = []) {
        this.announcement = announcement;
        this.description = description;
        this.dateTime = dateTime;
        this.exclusionList = exclusionList;
    }
}
//# sourceMappingURL=tags.model.js.map