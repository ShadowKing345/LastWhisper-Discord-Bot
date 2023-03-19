import { Permission } from "./permission.js";
import { Entity, OneToMany } from "typeorm";
import { EntityBase } from "../entityBase.js";

/**
 * Permission manager configuration object.
 */
@Entity()
export class PermissionManagerConfig extends EntityBase {
    @OneToMany( () => Permission, permission => permission.guildConfig, {
        cascade: true,
        orphanedRowAction: "delete",
        onDelete: "CASCADE",
    } )
    public permissions: Permission[];
}
