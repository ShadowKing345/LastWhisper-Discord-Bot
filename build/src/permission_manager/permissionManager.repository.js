var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { singleton } from "tsyringe";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/repository/repositoryBase.js";
import { deepMerge } from "../utils/index.js";
import { PermissionManagerConfig } from "./models/index.js";
let PermissionManagerRepository = class PermissionManagerRepository extends RepositoryBase {
    db;
    collectionName = "permission_manager";
    constructor(db) {
        super();
        this.db = db;
    }
    sanitiseOutput(config) {
        return deepMerge(new PermissionManagerConfig(), config);
    }
    get collection() {
        return this.db?.db?.collection(this.collectionName);
    }
};
PermissionManagerRepository = __decorate([
    singleton(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], PermissionManagerRepository);
export { PermissionManagerRepository };
//# sourceMappingURL=permissionManager.repository.js.map