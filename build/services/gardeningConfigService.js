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
exports.GardeningConfigService = void 0;
const gardeningConfigModel_1 = require("../models/gardeningConfigModel");
const gardeningConfigRepository_1 = require("../repositories/gardeningConfigRepository");
const typedi_1 = require("typedi");
let GardeningConfigService = class GardeningConfigService {
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
        result = new gardeningConfigModel_1.GardeningConfig();
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
GardeningConfigService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [gardeningConfigRepository_1.GardeningConfigRepository])
], GardeningConfigService);
exports.GardeningConfigService = GardeningConfigService;
