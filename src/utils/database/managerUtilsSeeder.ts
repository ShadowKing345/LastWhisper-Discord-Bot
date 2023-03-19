import { DataSource } from "typeorm";
import { isArray, isObject } from "../index.js";
import { ManagerUtilsConfig } from "../../entities/managerUtils.js";

/**
 * Seeds the database using a json object.
 * @param ds The datasource of the database.
 * @param guildId To provide to the classes.
 * @param data The actual json object to extract information form.
 */
export async function managerUtilsSeeder( ds: DataSource, guildId: string, data: unknown ): Promise<void> {
    if( isObject( data ) ) {
        const managerUtils = new ManagerUtilsConfig();
        managerUtils.guildId = guildId;

        if( "loggingChannel" in data && typeof data.loggingChannel === "string" ) {
            managerUtils.loggingChannel = data.loggingChannel;
        }

        if( "clearChannelBlacklist" in data && isArray( data.clearChannelBlacklist ) ) {
            managerUtils.clearChannelBlacklist = data.clearChannelBlacklist.filter( value => typeof value === "string" ) as string[];
        }

        await ds.getRepository<ManagerUtilsConfig>( ManagerUtilsConfig ).save( managerUtils );
    }
}