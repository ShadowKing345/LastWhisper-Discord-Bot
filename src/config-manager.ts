import fs from "fs";
import mongoose from "mongoose";
import { GuildConfig } from "./schemas/GuildConfigs";

export default class ConfigManager {
  configs: { [guildId: string]: { [configName: string]: {} } };
  dbUrl: string | undefined;
  useDb: string | undefined;
  filePath: string | undefined;

  constructor() {
    this.configs = {}
    this.useDb = process.env.USEDB;
    this.dbUrl = process.env.DBURL;
    this.filePath = process.env.FILEURL;
  }

  async loadConfigs() {
    if (this.useDb && this.dbUrl) {
      mongoose.connect(this.dbUrl).then(() => console.log("Connected to DB")).catch(error => console.error(error));
    } else {
      if (!this.filePath || !fs.existsSync(this.filePath) || !fs.lstatSync(this.filePath)?.isFile()) return;

      try {
        this.configs = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
      } catch (error) { console.error(error); }
    }
  }

  saveConfigs() {
    if (this.useDb) return;

    if (!this.filePath) return;
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.configs, null, 2));
    } catch (error) { console.error(error); }
  }

  async getConfig<T>(key: string, guildId: string | null): Promise<T | null> {
    if (!guildId) return null;

    if (this.useDb) {
      return (await GuildConfig.findOne({ guildId: guildId }))?.get(`configs.${key}`) as T | null;
    }
    else {
      if (!(guildId in this.configs)) return null;
      if (!(key in this.configs[guildId])) return null;
      return this.configs[guildId][key] as T;
    }
  }

  async getConfigs<T>(key: string): Promise<{ [guildId: string]: T }> {
    const result: { [guildId: string]: T } = {}

    if (this.useDb) {
      const k = `configs.${key}`;
      const guildsConfigs = await GuildConfig.find({ k: { "$exists": 1 } });

      guildsConfigs.forEach(guildConfig => {
        result[guildConfig.guildId] = guildConfig.get(k) as T
      });
    }
    else {
      Object.entries(this.configs)
        .forEach(entry => {
          const [k, v] = entry;
          if (key in v) {
            result[k] = v[key] as T;
          }
        });
    }
    return result;
  }

  async setConfig(key: string, guildId: string | null, data: {}) {
    if (!guildId) return;
    if (this.useDb) {
      const guildConfig = await GuildConfig.findOne({ guildId: guildId }) ?? new GuildConfig({ guildId: guildId });

      guildConfig.set(`configs.${key}`, data);

      await guildConfig.save();
    } else {
      if (!(guildId in this.configs)) this.configs[guildId] = {};
      this.configs[guildId][key] = data;
    }
  }
}
