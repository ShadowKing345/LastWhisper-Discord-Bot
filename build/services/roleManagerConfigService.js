"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleManagerConfigService = void 0;
const roleManagerConfigRepository_1 = require("../repositories/roleManagerConfigRepository");
const roleManager_1 = require("../models/roleManager");
const typedi_1 = require("typedi");
let RoleManagerConfigService = class RoleManagerConfigService {
    constructor(repo) {
        this.repo = repo;
    }
    async findOne(id) {
        return this.repo.findOne({ guildId: id });
    }
    async findOneOrCreate(id) {
        let result = await this.repo.findOne({ guildId: id });
        if (result)
            return result;
        result = new roleManager_1.RoleManagerConfig();
        result.guildId = id;
        return await this.repo.save(result);
    }
    async update(config) {
        return this.repo.save(config);
    }
    async getAll() {
        return this.repo.find({});
    }
};
RoleManagerConfigService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [roleManagerConfigRepository_1.RoleManagerConfigRepository])
], RoleManagerConfigService);
exports.RoleManagerConfigService = RoleManagerConfigService;
