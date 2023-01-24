import { TransportSingleOptions, TransportMultiOptions, TransportPipelineOptions, pino } from "pino";
export declare class LoggerConfigs {
    level: pino.Level;
    transports: TransportSingleOptions | TransportMultiOptions | TransportPipelineOptions;
    disable: boolean;
}
export declare enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error"
}
//# sourceMappingURL=loggerConfigs.d.ts.map