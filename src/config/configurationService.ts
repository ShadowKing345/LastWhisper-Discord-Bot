import { container as globalContainer, DependencyContainer } from "tsyringe";
import fs from "fs";
import { flattenObject } from "../utils/index.js";

export class ConfigurationService {
  public static readonly configPath = process.env.CONFIG_PATH ?? "./config/ProjectConfiguration.json";
  public static readonly devConfigPath = process.env.DEV_CONFIG_PATH ?? "./config/ProjectConfiguration.dev.json";
  private static flattenConfigs: Map<string, unknown> = new Map<string, unknown>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static RegisterConfiguration<T extends object>(key: string, entity: { new(): T }, container: DependencyContainer = globalContainer): void {
    if (ConfigurationService.flattenConfigs.size < 1) {
      this.getConfigs();
    }

    const map = ConfigurationService.flattenConfigs;

    console.log(map);

    if (!map.has(key)) {
      throw new Error(`Configuration file has no config with the key ${key}`);
    }

    const e = new entity();

    container.register<T>(entity, { useValue: e });
  }

  private static getConfigs(): void {
    ConfigurationService.flattenConfigs.clear();

    const configStr = ConfigurationService.readFile(ConfigurationService.configPath);
    if (!configStr) {
      return;
    }

    for (const [ k, v ] of Object.entries(flattenObject(JSON.parse(configStr) as object, true))) {
      ConfigurationService.flattenConfigs.set(k, v);
    }

    const devConfigStr = ConfigurationService.readFile(ConfigurationService.devConfigPath);
    if (!devConfigStr) {
      return;
    }

    for (const [ k, v ] of Object.entries(flattenObject(JSON.parse(devConfigStr) as object, true))) {
      ConfigurationService.flattenConfigs.set(k, v);
    }
  }

  private static readFile(path: string): string {
    if (!(path && fs.existsSync(path))) {
      return null;
    }

    return fs.readFileSync(path, "utf-8");
  }
}
