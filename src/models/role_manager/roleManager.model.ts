import { BasicModel } from "../../utils/models/index.js";

export class RoleManagerConfig extends BasicModel {
    public guildId: string;
    public acceptedRoleId: string;
    public reactionMessageIds: string[];
    public reactionListeningChannel: string;
}
