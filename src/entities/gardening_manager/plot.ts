import { Slot } from "./slot.js";
import { GardeningModuleConfig } from "./gardeningModuleConfig.js";
import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, Relation } from "typeorm";

/**
 * Representation of an FF XIV gardening plot.
 */
@Entity()
export class Plot extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: true })
  public name: string = null;

  @Column({ nullable: true })
  public description: string = null;

  // @OneToMany(() => Slot, slot => slot.plot, {
  //   cascade: true,
  //   orphanedRowAction: "delete",
  //   onDelete: "CASCADE",
  // })
  public slots: Slot[];

  @ManyToOne(() => GardeningModuleConfig, config => config.plots)
  @JoinColumn({name: "config_id"})
  public guildConfig: Relation<GardeningModuleConfig>;
}
