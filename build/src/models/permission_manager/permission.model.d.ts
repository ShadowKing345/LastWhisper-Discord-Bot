/**
 * Representation of a permission.
 */
export declare class Permission {
    roles: string[];
    mode?: PermissionMode;
    blackList?: boolean;
}
export declare enum PermissionMode {
    ANY = 0,
    STRICT = 1
}
//# sourceMappingURL=permission.model.d.ts.map