import { DataSource } from "typeorm";
import { isArray, isObject } from "../index.js";
import { RoleManagerConfig } from "../../entities/roleManager.js";

/**
 * Seeds the database using a json object.
 * @param ds The datasource of the database.
 * @param guildId To provide to the classes.
 * @param data The actual json object to extract information form.
 */
export async function roleManagerSeeder( ds: DataSource, guildId: string, data: unknown ): Promise<void> {
    if( isObject( data ) ) {
        const roleManagerConfig = new RoleManagerConfig();
        roleManagerConfig.guildId = guildId;

        if( "acceptedRoleId" in data && typeof data.acceptedRoleId === "string" ) {
            roleManagerConfig.acceptedRoleId = data.acceptedRoleId;
        }

        if( "reactionMessageIds" in data && isArray( data.reactionMessageIds ) ) {
            roleManagerConfig.reactionMessageIds = data.reactionMessageIds.filter( value => typeof value === "string" ) as string[];
        }

        if( "reactionListeningChannel" in data && typeof data.reactionListeningChannel === "string" ) {
            roleManagerConfig.reactionListeningChannel = data.reactionListeningChannel;
        }

        await ds.getRepository<RoleManagerConfig>( RoleManagerConfig ).save( roleManagerConfig );
    }
}