import { BasicModel } from "../utils/models/index.js";

export class ManagerUtilsConfig extends BasicModel {
    public guildId: string;
    public loggingChannel: string;
    public clearChannelBlacklist: string[];
}
