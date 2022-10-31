import { TransportSingleOptions, TransportMultiOptions, TransportPipelineOptions, pino } from "pino";
export declare class LoggerConfigs {
    level: pino.LevelWithSilent;
    transports: TransportSingleOptions | TransportMultiOptions | TransportPipelineOptions;
}
export declare enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error"
}
//# sourceMappingURL=loggerConfigs.d.ts.map