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
exports.ManagerUtilsConfigService = void 0;
const managerUtilsConfigRepository_1 = require("../repositories/managerUtilsConfigRepository");
const mangerUtils_1 = require("../models/mangerUtils");
const typedi_1 = require("typedi");
let ManagerUtilsConfigService = class ManagerUtilsConfigService {
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
        result = new mangerUtils_1.ManagerUtilsConfig();
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
ManagerUtilsConfigService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [managerUtilsConfigRepository_1.ManagerUtilsConfigRepository])
], ManagerUtilsConfigService);
exports.ManagerUtilsConfigService = ManagerUtilsConfigService;
