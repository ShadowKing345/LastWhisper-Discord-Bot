/**
 * Tag names for the event message parser.
 */
export class Tags {
  public announcement: string = null;
  public description: string = null;
  public dateTime: string = null;
  public exclusionList: string[] = [];

  constructor(
    announcement = "Event Announcement",
    description = "Event Description",
    dateTime = "Time",
    exclusionList: string[] = [],
  ) {
    this.announcement = announcement;
    this.description = description;
    this.dateTime = dateTime;
    this.exclusionList = exclusionList;
  }
}
