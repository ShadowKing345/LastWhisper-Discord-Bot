import { TransportSingleOptions, TransportMultiOptions, TransportPipelineOptions, pino } from "pino";

export class LoggingConfigs {
    level: pino.LevelWithSilent = LOGGING_LEVELS.info;
    transports: TransportSingleOptions | TransportMultiOptions | TransportPipelineOptions = pino.({});
}

export enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error",
}
