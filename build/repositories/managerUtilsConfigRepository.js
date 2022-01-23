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
var ManagerUtilsConfigRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerUtilsConfigRepository = void 0;
const databaseConfiguration_1 = require("../config/databaseConfiguration");
const typedi_1 = require("typedi");
let ManagerUtilsConfigRepository = ManagerUtilsConfigRepository_1 = class ManagerUtilsConfigRepository {
    constructor() { }
    async validate() {
        if (!this.collection)
            this.collection = await databaseConfiguration_1.DB.collection(ManagerUtilsConfigRepository_1.collectionName);
    }
    async save(config) {
        await this.validate();
        let result = await this.collection.findOneAndReplace({ guildId: config.guildId }, config, { upsert: true });
        return result.ok ? config : null;
    }
    async findOne(filter) {
        await this.validate();
        return await this.collection.findOne(filter);
    }
    async find(filter) {
        await this.validate();
        return await this.collection.find(filter).toArray();
    }
};
ManagerUtilsConfigRepository.collectionName = "manager_utils";
ManagerUtilsConfigRepository = ManagerUtilsConfigRepository_1 = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ManagerUtilsConfigRepository);
exports.ManagerUtilsConfigRepository = ManagerUtilsConfigRepository;
