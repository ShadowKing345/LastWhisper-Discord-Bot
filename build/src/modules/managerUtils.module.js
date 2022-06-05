var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "tsyringe";
import { ModuleBase } from "../classes/moduleBase.js";
import { ManagerUtilsService } from "../services/managerUtils.service.js";
let ManagerUtilsModule = class ManagerUtilsModule extends ModuleBase {
    managerUtilsService;
    constructor(managerUtilsService) {
        super();
        this.managerUtilsService = managerUtilsService;
        this.moduleName = "ManagerUtils";
        this.listeners = [
            { event: "guildBanAdd", run: async (_, member) => await this.onMemberBanned(member) },
            { event: "guildMemberRemove", run: async (client, member) => await this.onMemberRemoved(member) },
        ];
    }
    onMemberRemoved(member) {
        return this.managerUtilsService.onMemberRemoved(member);
    }
    onMemberBanned(ban) {
        return this.managerUtilsService.onMemberBanned(ban);
    }
};
ManagerUtilsModule = __decorate([
    injectable(),
    __metadata("design:paramtypes", [ManagerUtilsService])
], ManagerUtilsModule);
export { ManagerUtilsModule };
//# sourceMappingURL=managerUtils.module.js.map