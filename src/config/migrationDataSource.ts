import "reflect-metadata";
import path from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import { TypeORMLogger } from "../utils/logger/typeORMLogger.js";
import { CommonConfigurationKeys } from "./configurationKeys.js";
import { ConfigurationService } from "./configurationService.js";
import { DatabaseConfiguration, DatabaseLoggerConfigs } from "./entities/index.js";

/**
 * Attempts to create a new datasource to be used by throughout the project.
 * @param config Database configuration override.
 * @param logger Configurations for database logger.
 */
export function createDataSource(
    config: DatabaseConfiguration = ConfigurationService.getConfiguration( CommonConfigurationKeys.DATABASE ),
    logger: DatabaseLoggerConfigs = ConfigurationService.getConfiguration( "logger.database" )
): DataSource {
    const src = path.basename( path.join( path.dirname( import.meta.url ), ".." ) );

    return new DataSource( {
        type: config.type,
        host: config.host,
        username: config.username,
        password: config.password,
        port: config.port,
        database: config.database,
        entities: [ `${ src }/entities/**/*.[tj]s` ],
        migrations: [ `${ src }/migrations/**/*.[tj]s` ],
        migrationsTableName: "typeorm_migrations",
        logger: new TypeORMLogger( logger ),
    } as DataSourceOptions );
}

export default createDataSource();