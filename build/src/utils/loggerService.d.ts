import { pino } from "pino";
import { ProjectConfiguration } from "./models/index.js";
/**
 * Service used to handle logging calls.
 */
export declare class LoggerService {
    private readonly configs;
    private readonly pino;
    constructor(appConfigs: ProjectConfiguration);
    /**
     * Creates a child instance of a logger for the requesting class.
     * @param context The context name.
     * @return pino logger object.
     */
    buildLogger(context: string): pino.Logger;
}
/**
 * Decorator function used to inject an instance of the logger function rather than the logger service.
 * @param context Name to be used as context.
 * @return Instance of logger function
 * @see LoggerService.buildLogger
 */
export declare function createLogger(context: string): (target: any, propertyKey: string | symbol, parameterIndex: number) => any;
//# sourceMappingURL=loggerService.d.ts.map