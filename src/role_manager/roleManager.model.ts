import { BasicModel } from "../shared/models/basicModel.js";

export class RoleManagerConfig extends BasicModel {
    public guildId: string;
    public acceptedRoleId: string;
    public reactionMessageIds: string[];
    public reactionListeningChannel: string;
}
