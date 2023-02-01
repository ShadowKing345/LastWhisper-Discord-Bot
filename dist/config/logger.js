import { pino } from "pino";
import { CommonConfigurationKeys } from "./configurationKeys.js";
import { ConfigurationService } from "./configurationService.js";
import { LoggerConfigs, LOGGING_LEVELS } from "./entities/index.js";
import { EntitySchema } from "typeorm";
export class Logger {
    name;
    config;
    pino = null;
    constructor(name) {
        if (typeof name === "string") {
            this.name = name;
        }
        else if (!(name instanceof (EntitySchema))) {
            this.name = name.name;
        }
    }
    debug(message) {
        this.log(LOGGING_LEVELS.debug, message);
    }
    info(message) {
        this.log(LOGGING_LEVELS.info, message);
    }
    warn(message) {
        this.log(LOGGING_LEVELS.warn, message);
    }
    error(message) {
        this.log(LOGGING_LEVELS.error, message instanceof Error ? message.stack : message);
    }
    log(level, message) {
        if (!this.pino) {
            this.createLogger();
        }
        if (this.config.disable) {
            return;
        }
        this.pino[level]?.({ context: this.name }, message instanceof Object ? JSON.stringify(message) : message);
    }
    createLogger() {
        if (!this.config) {
            this.config = ConfigurationService.getConfiguration(CommonConfigurationKeys.LOGGER, LoggerConfigs);
        }
        this.pino = pino({
            level: this.config?.level ?? LOGGING_LEVELS.info,
            transport: this.config?.transports,
        });
    }
}
//# sourceMappingURL=logger.js.map