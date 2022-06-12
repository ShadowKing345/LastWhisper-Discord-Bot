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
import { Database } from "../config/databaseConfiguration.js";
import { PermissionManagerConfig } from "../models/permissionManagerConfig.model.js";
import { deepMerge } from "../utils/utils.js";
import { BasicRepository } from "./basicRepository.js";
let PermissionManagerRepository = class PermissionManagerRepository extends BasicRepository {
    db;
    collectionName = "permission_manager";
    constructor(db) {
        super();
        this.db = db;
        this.collection = db.collection(this.collectionName);
    }
    sanitiseOutput(config) {
        return deepMerge(new PermissionManagerConfig(), config);
    }
};
PermissionManagerRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [Database])
], PermissionManagerRepository);
export { PermissionManagerRepository };
//# sourceMappingURL=permissionManager.repository.js.map