import { Guild } from "discord.js";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from "typeorm";
import { PermissionManagerConfig } from "./permissionManagerConfig.js";

// Modes for how permissions are handled.
export enum PermissionMode {
    ANY,
    STRICT,
}

/**
 * Representation of a permission.
 */
@Entity()
export class Permission extends BaseEntity {
    @PrimaryGeneratedColumn( "uuid" )
    public id: string;

    @Column()
    public key: string;

    @Column( "text", { array: true } )
    public roles: string[] = [];

    @Column( { type: "enum", enum: PermissionMode, default: PermissionMode.ANY } )
    public mode: PermissionMode;

    @Column( { type: "boolean" } )
    public blackList?: boolean = false;

    @ManyToOne( () => PermissionManagerConfig, config => config.permissions )
    @JoinColumn( { name: "config_id" } )
    public guildConfig: Relation<PermissionManagerConfig>;

    /**
     * Returns the enum name of the current enum.
     */
    public get modeEnum(): string {
        return PermissionMode[this.mode];
    }

    /**
     * Returns an array of promises fetching the name of each role.
     * @param guild The guild to fetch the role names from.
     */
    public fetchRoleNames( guild: Guild ): Promise<string>[] {
        return this.roles.map( roleId => guild?.roles.fetch( roleId ).then( role => role?.name ) );
    }

    /**
     * Formats all the roles into an enum friendly format.
     * @param guild The guild to fetch the role names from.
     */
    public async formatRoles( guild: Guild ): Promise<string> {
        return this.roles.length > 0
            ? ( await Promise.allSettled( this.fetchRoleNames( guild ) ) ).join( "\n" )
            : "No roles were set.";
    }

    public merge( obj: Partial<Permission> ): Permission {
        if( obj.blackList ) {
            this.blackList = obj.blackList;
        }

        if( obj.mode ) {
            this.mode = obj.mode;
        }

        if( obj.roles ) {
            this.roles = obj.roles;
        }

        return this;
    }
}
