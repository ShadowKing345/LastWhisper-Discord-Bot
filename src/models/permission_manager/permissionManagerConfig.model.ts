import { BasicModel } from "../../utils/models/index.js";
import { Permission } from "./permission.model.js";

export class PermissionManagerConfig extends BasicModel {
    public guildId: string;
    public permissions: { [key: string]: Permission } = {};
}