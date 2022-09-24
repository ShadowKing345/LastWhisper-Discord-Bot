export class EventObj {
    public messageId: string = null;
    public name: string = null;
    public description: string = null;
    public dateTime: number = null;
    public additional: [ string, string ][] = [];

    constructor(messageId: string, name = "", description = "", dateTime: number = null, additional: [ string, string ][] = []) {
        this.messageId = messageId;
        this.name = name;
        this.description = description;
        this.dateTime = dateTime;
        this.additional = additional;
    }

    static isValid(obj: EventObj): boolean {
        return obj.name != "" && obj.description != "" && obj.dateTime != null;
    }
}