import { pino } from "pino";
import { ProjectConfiguration } from "../utils/objects/index.js";
import { Service } from "./service.js";
export declare class LoggerService extends Service {
    private readonly configs?;
    private readonly pino;
    constructor(appConfigs: ProjectConfiguration);
    buildLogger(context: string): pino.Logger;
}
export declare function createLogger(context: string): (target: any, propertyKey: string | symbol, parameterIndex: number) => any;
//# sourceMappingURL=loggerService.d.ts.map