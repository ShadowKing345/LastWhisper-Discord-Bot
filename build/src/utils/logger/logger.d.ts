import { pino } from "pino";
import { ProjectConfiguration } from "../models/index.js";
export declare enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error"
}
export declare class LoggerFactory {
    private appConfigs;
    constructor(appConfigs: ProjectConfiguration);
    buildLogger(name: string): pino.Logger;
}
//# sourceMappingURL=logger.d.ts.map