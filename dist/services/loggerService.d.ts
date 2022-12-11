import { pino } from "pino";
import { ProjectConfiguration } from "../utils/objects/index.js";
import { Transform } from "tsyringe/dist/typings/types/index.js";
export declare class LoggerService {
    private readonly configs?;
    private readonly pino;
    constructor(appConfigs: ProjectConfiguration);
    buildLogger(context: string): pino.Logger;
}
export declare class LoggerFactoryTransformer implements Transform<LoggerService, pino.Logger> {
    transform(incoming: LoggerService, args: string): pino.Logger;
}
//# sourceMappingURL=loggerService.d.ts.map