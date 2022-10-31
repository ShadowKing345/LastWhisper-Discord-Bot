import { pino } from "pino";
import { ProjectConfiguration } from "./models/index.js";
export declare class LoggerService {
    private readonly configs?;
    private readonly pino;
    constructor(appConfigs: ProjectConfiguration);
    buildLogger(context: string): pino.Logger;
}
export declare function createLogger(context: string): (target: any, propertyKey: string | symbol, parameterIndex: number) => any;
//# sourceMappingURL=loggerService.d.ts.map