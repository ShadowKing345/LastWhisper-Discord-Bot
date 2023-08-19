import Constructor from "../../utils/constructor.js";

export class ConfigurationObjectSettings<T> {
    public readonly target: Constructor<T>;
    public prefix?: string;
    public properties?: Record<string, ConfigurationObjectSettingsProperty> = {};

    public constructor( target: Constructor<T> ) {
        this.target = target;
    }
}

export class ConfigurationObjectSettingsProperty {
    public name: string;
    public type: unknown;
    public parser?: ( obj: unknown ) => unknown;
}