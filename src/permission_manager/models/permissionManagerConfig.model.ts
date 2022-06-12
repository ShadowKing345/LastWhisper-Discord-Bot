import { BasicModel } from "../../shared/models/basicModel.js";
import { Permission } from "./permission.model.js";

export class PermissionManagerConfig extends BasicModel {
    public guildId: string;
    public permissions: { [key: string]: Permission } = {};
}