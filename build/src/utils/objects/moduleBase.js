/**
 * Base class for a module.
 */
export class ModuleBase {
    permissionManagerService;
    moduleName = "";
    commands = [];
    listeners = [];
    tasks = [];
    constructor(permissionManagerService) {
        this.permissionManagerService = permissionManagerService;
    }
}
//# sourceMappingURL=moduleBase.js.map