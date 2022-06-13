var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppConfigs_1;
import fs from "fs";
import { singleton } from "tsyringe";
import { ConfigurationClass } from "../../shared/configuration.class.js";
import { buildLogger } from "../../shared/logger.js";
import { AppConfig } from "./models/index.js";
let AppConfigs = AppConfigs_1 = class AppConfigs extends ConfigurationClass {
    static configPath = "./appConfigs.json";
    static devConfigPath = "./appConfigs-dev.json";
    _config = null;
    logger = buildLogger(AppConfigs_1.name);
    constructor() {
        super();
        this.initConfigs();
    }
    static parseConfigFile(path, devPath) {
        if (!path || !fs.existsSync(path))
            return null;
        const config = Object.assign(new AppConfig(), JSON.parse(fs.readFileSync(path, "utf-8")));
        if (!devPath || !fs.existsSync(devPath))
            return config;
        return Object.assign(config, JSON.parse(fs.readFileSync(devPath, "utf-8")));
    }
    initConfigs() {
        this.logger.info("Loading Configurations", { context: "ClientSetup" });
        if (!fs.existsSync(AppConfigs_1.configPath)) {
            throw new Error("Configuration file was not found. You can create one with the generate-config script.");
        }
        return this.config;
    }
    get config() {
        return this._config ??= AppConfigs_1.parseConfigFile(AppConfigs_1.configPath, AppConfigs_1.devConfigPath);
    }
};
AppConfigs = AppConfigs_1 = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], AppConfigs);
export { AppConfigs };
//# sourceMappingURL=appConfigs.js.map