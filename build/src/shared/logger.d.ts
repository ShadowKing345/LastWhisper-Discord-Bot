import { pino } from "pino";
import { Transform } from "tsyringe/dist/typings/types/index.js";
import { AppConfig } from "../config/app_configs/index.js";
export declare enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error"
}
export declare class LoggerFactory {
    private appConfigs;
    constructor(appConfigs: AppConfig);
    buildLogger(name: string): pino.Logger;
}
export declare class LoggerFactoryTransformer implements Transform<LoggerFactory, pino.Logger> {
    transform(incoming: LoggerFactory, args: any): pino.Logger;
}
//# sourceMappingURL=logger.d.ts.map