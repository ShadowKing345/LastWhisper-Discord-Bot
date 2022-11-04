import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export class EventObj extends ToJsonBase {
    messageId = null;
    name = null;
    description = null;
    dateTime = null;
    additional = [];
    constructor(data = null) {
        super();
        if (data) {
            this.merge(data);
        }
    }
    get isValid() {
        return this.name != "" && this.description != "" && this.dateTime != null;
    }
}
//# sourceMappingURL=eventObj.model.js.map