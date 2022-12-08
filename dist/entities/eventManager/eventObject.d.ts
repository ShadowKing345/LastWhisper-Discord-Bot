import { EntityBase } from "../entityBase.js";
export declare class EventObject extends EntityBase {
    messageId: string;
    name: string;
    description: string;
    dateTime: number;
    additional: [string, string][];
    constructor();
    get isValid(): boolean;
    merge(obj: Partial<EventObject>): EventObject;
}
//# sourceMappingURL=eventObject.d.ts.map