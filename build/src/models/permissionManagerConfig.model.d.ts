export declare class PermissionManagerConfig {
    _id: string;
    guildId: string;
    permissions: {
        [key: string]: Permission;
    };
}
export declare enum PermissionMode {
    ANY = 0,
    STRICT = 1
}
export declare class Permission {
    roles: string[];
    mode?: PermissionMode;
    blackList?: boolean;
}
export declare type PermissionKeys = {
    $index: string;
    [key: string]: string | {
        $index: string;
        [key: string]: string;
    };
};
//# sourceMappingURL=permissionManagerConfig.model.d.ts.map