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
var EventManagerRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManagerRepository = void 0;
const databaseConfiguration_1 = require("../config/databaseConfiguration");
const typedi_1 = require("typedi");
let EventManagerRepository = EventManagerRepository_1 = class EventManagerRepository {
    constructor() { }
    async validate() {
        if (!this.collection)
            this.collection = await databaseConfiguration_1.DB.collection(EventManagerRepository_1.collectionName);
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
    async bulkSave(configs) {
        if (configs.length <= 0)
            return;
        await this.validate();
        let bulk = this.collection.initializeOrderedBulkOp();
        configs.forEach(config => bulk.find({ guildId: config.guildId }).replaceOne(config));
        await bulk.execute();
    }
};
EventManagerRepository.collectionName = "event_manager";
EventManagerRepository = EventManagerRepository_1 = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], EventManagerRepository);
exports.EventManagerRepository = EventManagerRepository;
