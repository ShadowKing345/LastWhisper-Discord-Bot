import { BasicModel } from "./basicModel.js";

export class RoleManagerConfig extends BasicModel {
    public guildId: string;
    public acceptedRole: string;
    public reactionMessageIds: string[];
    public reactionListeningChannel: string;
}
