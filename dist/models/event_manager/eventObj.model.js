import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { DateTime } from "luxon";
export class EventObj extends ToJsonBase {
    id = null;
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
        return this.name != "" && this.description != "" && this.dateTime != null && this.dateTime > DateTime.now().toUnixInteger();
    }
}
//# sourceMappingURL=eventObj.model.js.map