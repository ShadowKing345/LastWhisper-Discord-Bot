import fs from "fs";
import path from "path";

export default class ConfigManager {
  filePath: string;
  configs: { [guildId: string]: { [configName: string]: {} } };

  constructor(filePath: string) {
    this.filePath = path.join(__dirname, filePath);
    this.configs = {}
  }

  loadConfigs() {
    if (!fs.existsSync(this.filePath) || !fs.lstatSync(this.filePath)?.isFile()) return;

    try {
      this.configs = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
    } catch (error) { console.error(error); }
  }

  saveConfigs() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.configs, null, 2));
    } catch (error) { console.error(error); }
  }

  getConfig<T>(key: string, guildId: string | null): T | null {
    if (!guildId) return null;
    if (!(guildId in this.configs)) return null;
    if (!(key in this.configs[guildId])) return null;
    return this.configs[guildId][key] as T;
  }

  getConfigs<T>(key: string): { [guildId: string]: T } {
    const result: { [guildId: string]: T } = {}

    Object.entries(this.configs)
      .forEach(entry => {
        const [k, v] = entry;
        if (key in v) {
          result[k] = v[key] as T;
        }
      });

    return result;
  }

  setConfig(key: string, guildId: string | null, data: object): void {
    if (!guildId) return;
    if (!(guildId in this.configs)) this.configs[guildId] = {};
    this.configs[guildId][key] = data;
  }
}
