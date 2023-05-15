import * as crypto from "crypto";
import path from "path";
import { constructor } from "tsyringe/dist/typings/types/index.js";
import { DataSource, DataSourceOptions, EntityTarget } from "typeorm";
import { createDatabase, dropDatabase } from "typeorm-extension";
import { DatabaseService } from "../../src/config/index.js";
import { EntityBase } from "../../src/entities/entityBase.js";
import { Repository } from "../../src/repositories/base/repository.js";

function createDataSourceConfigs(): DataSourceOptions {
    const src = path.basename( path.join( path.dirname( import.meta.url ), "../../src" ) );

    return {
        database: `test-${ crypto.randomUUID() }`,
        type: "postgres",
        host: "127.0.0.1",
        port: 5432,
        username: "postgresql",
        password: "postgresql",
        entities: [ `${ src }/entities/**/*.[tj]s` ],
        migrations: [ `${ src }/migrations/**/*.[tj]s` ],
        migrationsTableName: "typeorm_migrations",
    } as DataSourceOptions;
}

export type MockRepository<G extends EntityBase, T extends Repository<G>> = T & {
    $tearUp: () => Promise<unknown>;
    $tearDown: () => Promise<unknown>;
    $clear: () => Promise<unknown>;
}

export function mockRepository<G extends EntityBase, T extends Repository<G>>( construct: constructor<T>, entityTarget: EntityTarget<T> ): MockRepository<G, T> {
    const dbOpts = createDataSourceConfigs();
    const db = new DatabaseService();
    db['_dataSource'] = new DataSource( dbOpts );

    const instance = new construct( db, entityTarget ) as unknown as MockRepository<G, T>;

    instance.$tearUp = async function() {
        return createDatabase( {
            options: dbOpts,
            initialDatabase: 'Bot',
            synchronize: true,
            ifNotExist: true
        } ).then( () => db.connect() );
    }

    instance.$tearDown = async function() {
        return db.disconnect().then( () => dropDatabase( {
            options: dbOpts,
            initialDatabase: 'Bot',
            ifExist: true
        } ) );
    }

    instance.$clear = async function() {
        return this['repo'].clear();
    }

    return instance;
}