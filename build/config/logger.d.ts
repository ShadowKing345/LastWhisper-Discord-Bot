import { LOGGING_LEVELS } from "./entities/index.js";
import { EntityTarget } from "typeorm";
export declare class Logger {
    private readonly name;
    private config;
    private pino;
    constructor(name: EntityTarget<unknown>);
    debug(message: string | object): void;
    info(message: string | object): void;
    warn(message: string | object): void;
    error(message: string | object | unknown): void;
    log(level: LOGGING_LEVELS, message: string | object): void;
    private createLogger;
}
//# sourceMappingURL=logger.d.ts.map