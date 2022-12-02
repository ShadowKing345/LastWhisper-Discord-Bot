import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

/**
 * Buff object representing a days worth of buffs.
 */
@Entity()
export class Buff {
  @PrimaryGeneratedColumn()
  public id: string = null;

  @Column()
  public text: string = null;

  @Column()
  public imageUrl: string = null;
}