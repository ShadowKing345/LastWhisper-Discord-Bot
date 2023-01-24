import { DependencyContainer } from "tsyringe";
export declare class ConfigurationService {
    static readonly configPath: string;
    static readonly devConfigPath: string;
    private static flattenConfigs;
    static RegisterConfiguration<T extends object>(key: string, entity: {
        new (): T;
    }, container?: DependencyContainer): void;
    static GetConfiguration<T extends object>(key: string, entity: {
        new (): T;
    }): T;
    private static createConfigMap;
    private static readFile;
    private static parseConfigFile;
    private static parseConfigs;
}
//# sourceMappingURL=configurationService.d.ts.map