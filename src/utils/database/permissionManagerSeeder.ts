import { DataSource } from "typeorm";
import { isArray, isEnum, isObject } from "../index.js";
import { Permission, PermissionManagerConfig, PermissionMode } from "../../entities/permissionManager/index.js";

/**
 * Seeds the database using a json object.
 * @param ds The datasource of the database.
 * @param guildId To provide to the classes.
 * @param data The actual json object to extract information form.
 */
export async function permissionManagerSeeder( ds: DataSource, guildId: string, data: unknown ): Promise<void> {
    if( isObject( data ) ) {
        const permissionManagerConfig = new PermissionManagerConfig();
        permissionManagerConfig.guildId = guildId;

        if( "permissions" in data && isArray( data.permissions ) ) {
            for( const permission of data.permissions ) {
                if( !isObject( permission ) ) {
                    continue;
                }
                const p = new Permission();

                if( "key" in permission && typeof permission.key === "string" ) {
                    p.key = permission.key;
                }

                if( "roles" in permission && isArray( permission.roles ) ) {
                    p.roles = permission.roles.filter( item => typeof item === "string" ) as string[];
                }

                if( "mode" in permission && isEnum( permission.mode, PermissionMode ) ) {
                    p.mode = permission.mode as PermissionMode;
                }

                if( "blackList" in permission && typeof permission.blackList === "boolean" ) {
                    p.blackList = permission.blackList;
                }

                if( !p.key || p.roles.length <= 0 ) {
                    continue;
                }

                p.guildConfig = permissionManagerConfig;
                permissionManagerConfig.permissions.push( p );
            }
        }

        await ds.getRepository<PermissionManagerConfig>( PermissionManagerConfig ).save( permissionManagerConfig );
    }
}