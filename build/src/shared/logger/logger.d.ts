import { pino } from "pino";
import { AppConfig } from "../../config/app_configs/index.js";
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
//# sourceMappingURL=logger.d.ts.map