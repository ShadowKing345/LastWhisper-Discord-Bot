export class EventObj {
    messageId = null;
    name = null;
    description = null;
    dateTime = null;
    additional = [];
    constructor(messageId, name = "", description = "", dateTime = null, additional = []) {
        this.messageId = messageId;
        this.name = name;
        this.description = description;
        this.dateTime = dateTime;
        this.additional = additional;
    }
    static isValid(obj) {
        return obj.name != "" && obj.description != "" && obj.dateTime != null;
    }
}
//# sourceMappingURL=eventObj.model.js.map