import { ProjectConfiguration } from "../models/index.js";
import { DependencyContainer } from "tsyringe";
export declare const configPath: string;
export declare const devConfigPath: string;
export declare function parseConfigFile(path: string, devPath?: string): ProjectConfiguration;
export declare function generateConfigObject(container?: DependencyContainer): void;
//# sourceMappingURL=appConfigs.d.ts.map