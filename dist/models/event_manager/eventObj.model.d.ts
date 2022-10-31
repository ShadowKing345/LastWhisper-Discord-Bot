export declare class EventObj {
    messageId: string;
    name: string;
    description: string;
    dateTime: number;
    additional: [string, string][];
    constructor(messageId: string, name?: string, description?: string, dateTime?: number, additional?: [string, string][]);
    static isValid(obj: EventObj): boolean;
}
//# sourceMappingURL=eventObj.model.d.ts.map