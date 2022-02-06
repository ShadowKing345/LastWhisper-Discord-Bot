import fs from "fs";
export let CONFIGS = null;
class Settings {
}
export class AppConfigs {
}
export function initConfigs() {
    const rawData = fs.readFileSync("./appConfigs.json", "utf8");
    const settings = Object.assign(new Settings, JSON.parse(rawData));
    CONFIGS = Object.assign(new AppConfigs, settings.production, settings.development);
    return CONFIGS;
}
//# sourceMappingURL=appConfigs.js.map