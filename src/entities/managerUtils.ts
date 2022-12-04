import { Entity, Column } from "typeorm";
import { EntityBase } from "./entityBase.js";

/**
 * Manager utils configuration object.
 */
@Entity()
export class ManagerUtilsConfig extends EntityBase {
  @Column({ nullable: true })
  public loggingChannel: string = null;

  @Column("text", { array: true })
  public clearChannelBlacklist: string[];
}
