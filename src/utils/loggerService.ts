import { pino } from "pino";
import { singleton, injectWithTransform } from "tsyringe";

import { ProjectConfiguration } from "./models/index.js";
import { Transform } from "tsyringe/dist/typings/types/index.js";
import { LOGGING_LEVELS, LoggingConfigs } from "./models/loggingConfigs.js";

/**
 * Service used to handle logging calls.
 */
@singleton()
export class LoggerService {
    private readonly configs: LoggingConfigs;
    private readonly pino: pino.Logger;

    constructor(appConfigs: ProjectConfiguration) {
        this.configs = appConfigs.logging;

        this.pino = pino({
            level: this.configs.level ?? LOGGING_LEVELS.info,
            transport: this.configs.transports,
        })
    }

    /**
     * Creates a child instance of a logger for the requesting class.
     * @param context The context name.
     * @return pino logger object.
     */
    buildLogger(context: string): pino.Logger {
        this.pino.info("Testing");
        return this.pino.child({ context });
    }
}

/**
 * Factory function to create a logger instance.
 * Should be used in conduction with the decorator function.
 * @see createLogger
 */
class LoggerFactoryTransformer implements Transform<LoggerService, pino.Logger> {
    public transform(incoming: LoggerService, args: any): pino.Logger {
        return incoming.buildLogger(args);
    }
}

/**
 * Decorator function used to inject an instance of the logger function rather then the logger service.
 * @param context Name to be used as context.
 * @return Instance of logger function
 * @see LoggerService.buildLogger
 */
export function createLogger(context: string) {
    return injectWithTransform(LoggerService, LoggerFactoryTransformer, context);
}