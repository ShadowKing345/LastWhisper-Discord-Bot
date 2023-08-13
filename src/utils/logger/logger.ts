import { ConfigurationService } from "../../configurations/configurationService.js";
import { CommonConfigurationKeys, LoggerConfigs, LOGGING_LEVELS } from "../../configurations/index.js";
import { isArray, isObject, isStringNullOrEmpty } from "../index.js";
import { pino, Logger as L, Level, LogFn } from "pino";

/**
 * Service used to handle logging calls.
 */
export class Logger {
    private name: string;
    private config: LoggerConfigs;
    private pino: L = null;

    public debug( message: unknown, additional: Record<string, unknown> = undefined, ...args: unknown[] ): void {
        this.log( LOGGING_LEVELS.debug, message, additional, ...args );
    }

    public info( message: unknown, additional: Record<string, unknown> = undefined, ...args: unknown[] ): void {
        this.log( LOGGING_LEVELS.info, message, additional, ...args );
    }

    public warn( message: unknown, additional: Record<string, unknown> = undefined, ...args: unknown[] ): void {
        this.log( LOGGING_LEVELS.warn, message, additional, ...args );
    }

    public error( message: unknown, additional: Record<string, unknown> = undefined, ...args: unknown[] ): void {
        this.log( LOGGING_LEVELS.error, message instanceof Error ? message.stack : message, additional, ...args );
    }

    public log( level: Level, message: unknown, additional: Record<string, unknown> = undefined, ...args: unknown[] ): void {
        if( process.env.DEV_DISABLE_LOGGING ) {
            return;
        }

        if( !this.pino ) {
            this.createLogger();
        }

        if( this.config.disable ) {
            return;
        }

        let msg: string;
        if( typeof message === "string" ) {
            msg = message;
        } else if( typeof message === "object" ) {
            msg = JSON.stringify( message );
        } else {
            msg = String( message );
        }

        ( this.pino[level] as LogFn )?.<{ context: string, additional?: Record<string, unknown> }>( {
            context: this.name,
            additional: this.cleanAdditional( additional )
        }, msg, ...args );
    }

    private cleanAdditional( additional: Record<string, unknown> = undefined ): Record<string, unknown> | undefined {
        if( additional === undefined ) {
            return undefined;
        }

        const result: Record<string, unknown> = Object.entries( additional )
            .map( ( [ key, value ] ) => {
                if( isArray( value ) && value.length === 0 ) {
                    value = undefined;
                }

                if( isObject( value ) && Object.keys( value ).length === 0 ) {
                    value = undefined;
                }

                return [ key, value ];
            } )
            .filter( ( [ , value ] ) => value !== undefined )
            .reduce( ( prev, [ key, value ] ) => {
                prev[key as string] = value;
                return prev;
            }, {} );

        return Object.keys( result ).length === 0 ? undefined : result;
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

    public static build( name: unknown ) {
        const logger = new Logger();

        if( typeof name === "string" ) {
            logger.name = name;
        } else if( typeof name === "object" ) {
            if( name.constructor ) {
                logger.name = name.constructor.name;
            } else if( "name" in name && typeof name.name === "string" && !isStringNullOrEmpty( name.name ) ) {
                logger.name = name.name
            }
        }

        return logger;
    }
}