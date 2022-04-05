import { BasicModel } from "./basicModel.js";

export class ManagerUtilsConfig extends BasicModel {
    public guildId: string;
    public loggingChannel: string;
    public clearChannelBlacklist: string[];
}
