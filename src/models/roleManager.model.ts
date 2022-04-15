import { BasicModel } from "./basicModel.js";

export class RoleManagerConfig extends BasicModel {
    public guildId: string;
    public newUserRoleId: string;
    public memberRoleId: string;
    public reactionMessageIds: string[];
    public reactionListeningChannel: string;
}
