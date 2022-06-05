import { injectable } from "tsyringe";

import { Client } from "../classes/client.js";
import { ModuleBase } from "../classes/moduleBase.js";
import { RoleManagerService } from "../services/roleManager.service.js";

@injectable()
export class RoleManagerModule extends ModuleBase {
    constructor(private roleManagerService: RoleManagerService) {
        super();

        this.moduleName = "RoleManager";
        this.listeners = [
            { event: "ready", run: async (client) => this.onReady(client) },
        ];
    }

    private onReady(client: Client): Promise<void> {
        return this.roleManagerService.onReady(client);
    }
}
