import { PermissionManagerService } from "../services/permissionManager.js";

/**
 * Base class for a module.
 */
export abstract class Module {
    protected constructor( public permissionManagerService: PermissionManagerService ) {
    }
}
