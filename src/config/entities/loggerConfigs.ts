import { TransportSingleOptions, TransportMultiOptions, TransportPipelineOptions, pino } from "pino";

/**
 * Configuration object for the logger service.
 */
export class LoggerConfigs {
    public level: pino.Level = LOGGING_LEVELS.info;
    public transports: TransportSingleOptions | TransportMultiOptions | TransportPipelineOptions = null;
    public disable = false;
}

export enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error",
}
