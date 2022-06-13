import { pino } from "pino";
import { Transform } from "tsyringe/dist/typings/types/index.js";
import { AppConfigs } from "../config/app_configs/index.js";
export declare enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error"
}
export declare class LoggerFactory {
    private appConfigs;
    constructor(appConfigs: AppConfigs);
    buildLogger(name: string): pino.Logger;
}
export declare class LoggerFactoryTransformer implements Transform<LoggerFactory, pino.Logger> {
    transform(incoming: LoggerFactory, args: any): pino.Logger;
}
//# sourceMappingURL=logger.d.ts.map