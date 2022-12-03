import { Permission } from "./permission.js";
import { Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { GuildConfigBase } from "../guildConfigBase.js";

/**
 * Permission manager configuration object.
 */
@Entity()
export class PermissionManagerConfig extends GuildConfigBase {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @OneToMany(() => Permission, permission => permission.guildConfig, {
    cascade: true,
    orphanedRowAction: "delete",
    onDelete: "CASCADE",
  })
  public permissions: Permission[];
}
