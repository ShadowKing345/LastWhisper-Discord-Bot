import { IEntity } from "../../utils/objects/repositoryBase.js";
import { Permission } from "./permission.model.js";

/**
 * Permission manager configuration object.
 */
export class PermissionManagerConfig implements IEntity {
    public _id;
    public guildId: string;
    public permissions: { [key: string]: Permission } = {};
}