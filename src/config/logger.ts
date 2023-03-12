import { pino } from "pino";
import { CommonConfigurationKeys } from "./configurationKeys.js";
import { ConfigurationService } from "./configurationService.js";
import { LoggerConfigs, LOGGING_LEVELS } from "./entities/index.js";
import { EntitySchema, EntityTarget } from "typeorm";

/**
 * Service used to handle logging calls.
 */
export class Logger {
    private readonly name: string;
    private config: LoggerConfigs;
    private pino: pino.Logger = null;

    constructor( name: EntityTarget<unknown> ) {
        if( typeof name === "string" ) {
            this.name = name;
        } else if( !( name instanceof EntitySchema<unknown> ) ) {
            this.name = name.name;
        }
    }

    public debug( message: string | object ): void {
        this.log( LOGGING_LEVELS.debug, message );
    }

    public info( message: string | object ): void {
        this.log( LOGGING_LEVELS.info, message );
    }

    public warn( message: string | object ): void {
        this.log( LOGGING_LEVELS.warn, message );
    }

    public error( message: string | object | unknown ): void {
        this.log( LOGGING_LEVELS.error, message instanceof Error ? message.stack : message as string | object );
    }

    public log( level: LOGGING_LEVELS, message: string | object, more: object = {} ): void {
        if( process.env.DEV_DISABLE_LOGGING ) {
            return;
        }
        
        if( !this.pino ) {
            this.createLogger();
        }

        if( this.config.disable ) {
            return;
        }
        
        this.pino[level]?.( { context: this.name, ...more }, message instanceof Object ? JSON.stringify( message ) : message );
    }

    private createLogger(): void {
        if( !this.config ) {
            this.config = ConfigurationService.getConfiguration<LoggerConfigs>( CommonConfigurationKeys.LOGGER );
        }

        this.pino = pino( {
            level: this.config?.level ?? LOGGING_LEVELS.info,
            transport: this.config?.transports,
        } );
    }
}