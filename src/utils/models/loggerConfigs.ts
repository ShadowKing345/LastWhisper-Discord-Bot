import { TransportSingleOptions, TransportMultiOptions, TransportPipelineOptions, pino } from "pino";

/**
 * Configuration object for the logger service.
 */
export class LoggerConfigs {
    level: pino.LevelWithSilent = LOGGING_LEVELS.info;
    transports: TransportSingleOptions | TransportMultiOptions | TransportPipelineOptions;
}

export enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error",
}
