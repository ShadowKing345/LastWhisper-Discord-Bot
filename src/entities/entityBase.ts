import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

export class EntityBase extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public guildId: string = null;
}
