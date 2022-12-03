import { BaseEntity, Column } from "typeorm";

export class GuildConfigBase extends BaseEntity {
  @Column()
  public guildId: string = null;
}
