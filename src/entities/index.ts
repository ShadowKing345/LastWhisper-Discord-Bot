import { BuffManagerEntities } from "./buffManager/index.js";
import { EventManagerEntities } from "./eventManager/index.js";
import { GardeningManagerEntities } from "./gardeningManager/index.js";
import { PermissionManagerEntities } from "./permissionManager/index.js";
import { RoleManagerConfig } from "./roleManager.js";
import { ManagerUtilsConfig } from "./managerUtils.js";

export const AllEntities = [ ...BuffManagerEntities, ...EventManagerEntities, ...GardeningManagerEntities, ...PermissionManagerEntities, RoleManagerConfig, ManagerUtilsConfig ];