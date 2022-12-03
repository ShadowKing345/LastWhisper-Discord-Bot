import { Permission } from "./permission.js";
import { deepMerge } from "../../utils/index.js";
import { BaseEntity } from "typeorm";

/**
 * Permission manager configuration object.
 */
export class PermissionManagerConfig extends BaseEntity {
  public id: string;
  public guildId: string = null;
  public permissions: { [key: string]: Permission } = {};

  public merge(obj: Partial<PermissionManagerConfig>): PermissionManagerConfig {
    if (obj.id) {
      this.id = obj.id;
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
