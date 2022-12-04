import { Entity, Column } from "typeorm";
import { EntityBase } from "../entityBase.js";

/**
 * Buff object representing a days worth of buffs.
 */
@Entity()
export class Buff extends EntityBase {
  @Column()
  public text: string = null;

  @Column()
  public imageUrl: string = null;
}
