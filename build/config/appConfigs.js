import * as fs from "fs";
const configPath = "./appConfigs.json", devConfigPath = "./appConfigs-dev.json";
export let CONFIGS = null;
export class AppConfigs {
}
export class CommandRegistrationConfiguration {
}
export function initConfigs() {
    if (!fs.existsSync(configPath)) {
        throw new ConfigurationError("No configuration file named appConfigs.json found in root directory. Please create one.");
    }
    const raw = fs.readFileSync(configPath, "utf-8");
    let dev;
    if (fs.existsSync(devConfigPath)) {
        dev = fs.readFileSync(devConfigPath, "utf-8");
    }
    CONFIGS = Object.assign(new AppConfigs, JSON.parse(raw));
    if (dev) {
        Object.assign(CONFIGS, JSON.parse(dev));
    }
    return CONFIGS;
}
export class ConfigurationError extends Error {
}
//# sourceMappingURL=appConfigs.js.map