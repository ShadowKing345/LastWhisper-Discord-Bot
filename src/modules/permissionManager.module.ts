import { injectable } from "tsyringe";

import { ModuleBase } from "../classes/moduleBase.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";

@injectable()
export class PermissionManagerModule extends ModuleBase {
    constructor(private permissionManagerService: PermissionManagerService) {
        super();

        this.moduleName = "PermissionManager";
        this.commands = [];
    }
}
