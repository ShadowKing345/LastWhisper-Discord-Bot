import { flattenObject } from "../index.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";

/**
 * Adds an object of values into the permission service keys list.
 * Note that the object will get flattened down to a depth of 1 then the values are processed.
 * The keys of the object will be ignored.
 */
export function addPermissionKeys() {
  return function (target: object, propertyKey: string) {
    for (const value of Object.values(flattenObject(target[propertyKey] as object))) {
      PermissionManagerService.addPermissionKey(value as string);
    }
  };
}
