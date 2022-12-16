import { pino } from "pino";
import { LOGGING_LEVELS, LoggerConfigs } from "./objects/loggerConfigs.js";
import { container } from "tsyringe";
import { EntityTarget, EntitySchema } from "typeorm";

/**
 * Service used to handle logging calls.
 */
export class Logger {
  private readonly name: string;
  private config: LoggerConfigs;
  private pino: pino.Logger = null;

  constructor(name: EntityTarget<unknown>) {
    if (typeof name === "string") {
      this.name = name;
    } else if (!(name instanceof EntitySchema<unknown>)) {
      this.name = name.name;
    }
  }

  public debug(message: string | object): void {
    this.log(LOGGING_LEVELS.debug, message);
  }

  public info(message: string | object): void {
    this.log(LOGGING_LEVELS.info, message);
  }

  public warn(message: string | object): void {
    this.log(LOGGING_LEVELS.warn, message);
  }

  public error(message: string | object | unknown): void {
    this.log(LOGGING_LEVELS.error, message as string | object);
  }

  public log(level: LOGGING_LEVELS, message: string | object): void {
    if (!this.pino) {
      this.createLogger();
    }

    if (this.config.disable) {
      return;
    }

    this.pino[level]?.({ context: this.name }, message instanceof Object ? JSON.stringify(message) : message);
  }

  private createLogger(): void {
    if (!this.config) {
      this.config = container.resolve<LoggerConfigs>(LoggerConfigs);
    }

    this.pino = pino({
      level: this.config?.level ?? LOGGING_LEVELS.info,
      transport: this.config?.transports,
    });
  }
}