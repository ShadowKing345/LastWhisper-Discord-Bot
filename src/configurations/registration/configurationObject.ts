import constructor from "../../utils/constructor.js";

export class ConfigurationObject<T> {
    target: constructor<T>

    prefix?: string;
    propertyNameOverride?: [];
}