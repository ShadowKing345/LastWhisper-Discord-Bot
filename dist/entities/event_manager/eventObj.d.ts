import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export declare class EventObj extends ToJsonBase<EventObj> {
    id: string;
    name: string;
    description: string;
    dateTime: number;
    additional: [string, string][];
    constructor(data?: Partial<EventObj>);
    get isValid(): boolean;
}
//# sourceMappingURL=eventObj.d.ts.map