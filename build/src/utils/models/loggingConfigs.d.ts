import { pino } from "pino";
export declare class LoggingConfigs {
    level: LOGGING_LEVELS;
    transports: pino.TransportMultiOptions;
}
export declare enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error"
}
//# sourceMappingURL=loggingConfigs.d.ts.map