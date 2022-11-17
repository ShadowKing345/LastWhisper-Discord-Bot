import { IEntity } from "../../utils/objects/repositoryBase.js";
import { Permission } from "./permission.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { deepMerge } from "../../utils/index.js";

/**
 * Permission manager configuration object.
 */
export class PermissionManagerConfig extends ToJsonBase<PermissionManagerConfig> implements IEntity<string> {
  public _id: string;
  public guildId: string = null;
  public permissions: { [key: string]: Permission } = {};

  public merge(obj: Partial<PermissionManagerConfig>): PermissionManagerConfig {
    if (obj._id) {
      this._id = obj._id;
    }

    if (obj.guildId) {
      this.guildId = obj.guildId;
    }

    if (obj.permissions) {
      this.permissions = deepMerge(this.permissions ?? {}, obj.permissions);
    }

    return this;
  }
}
