import { AbstractLogger, LoggerOptions, LogLevel, LogMessage } from "typeorm";
import { LOGGING_LEVELS } from "./entities/index.js";
import { Logger } from "./logger.js";

export class TypeORMLogger extends AbstractLogger {
    public constructor( opts: LoggerOptions, private logger: Logger ) {
        super( opts );
    }

    protected writeLog( level: LogLevel, logMessages: LogMessage | string | number | ( LogMessage | string | number )[] ): void {
        const preparedMessages = this.prepareLogMessages( logMessages );

        for( const message of preparedMessages ) {
            const dbData = {
                type: message.type,
                format: message.format,
                parameters: message.parameters,
                additionalInfo: message.additionalInfo
            };

            switch( level ) {
                case "error":
                    this.logger.log( LOGGING_LEVELS.error, String( message.message ), { dbData } );
                    break;
                case "warn":
                    this.logger.log( LOGGING_LEVELS.warn, String( message.message ), { dbData } );
                    break;
                case "info":
                case "migration":
                case "schema":
                    this.logger.log( LOGGING_LEVELS.info, String( message.message ), { dbData } );
                    break;
                case "query":
                case "log":
                    this.logger.log( LOGGING_LEVELS.debug, String( message.message ), { dbData } );
                    break;
                default:
                    break;
            }
        }
    }
}