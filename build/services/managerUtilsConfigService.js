"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerUtilsConfigService = void 0;
const managerUtilsConfigRepository_1 = require("../repositories/managerUtilsConfigRepository");
const mangerUtils_1 = require("../models/mangerUtils");
class ManagerUtilsConfigService {
    constructor() {
        this.repo = new managerUtilsConfigRepository_1.ManagerUtilsConfigRepository();
    }
    async findOne(id) {
        return this.repo.findOne({ _id: id });
    }
    async findOneOrCreate(id) {
        let result = await this.repo.findOne({ _id: id });
        if (result)
            return result;
        result = new mangerUtils_1.ManagerUtilsConfig();
        result._id = id;
        return await this.repo.save(result);
    }
    async update(config) {
        return this.repo.save(config);
    }
    async getAll() {
        return this.repo.find({});
    }
}
exports.ManagerUtilsConfigService = ManagerUtilsConfigService;
