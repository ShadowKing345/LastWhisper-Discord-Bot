import { IEntity } from "../../utils/objects/repositoryBase.js";

/**
 * Manager utils configuration object.
 */
export class ManagerUtilsConfig implements IEntity {
    public _id;
    public guildId: string;
    public loggingChannel: string;
    public clearChannelBlacklist: string[];
}
