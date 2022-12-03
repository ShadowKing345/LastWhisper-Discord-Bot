import { BaseEntity } from "typeorm";

/**
 * Manager utils configuration object.
 */
export class ManagerUtilsConfig extends BaseEntity {
  public id: string;
  public guildId: string = null;
  public loggingChannel: string = null;
  public clearChannelBlacklist: string[] = [];
}
