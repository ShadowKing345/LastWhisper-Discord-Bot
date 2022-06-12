export class PermissionManagerConfig {
    public _id: string;
    public guildId: string;
    public permissions: { [key: string]: Permission } = {};
}

export enum PermissionMode {
    ANY,
    STRICT,
}

export class Permission {
    public roles: string[] = [];
    public mode?: PermissionMode = PermissionMode.ANY;
    public blackList?: boolean = false;
}

export type PermissionKeys = {
    $index: string,
    [key: string]: string | {
        $index: string,
        [key: string]: string
    }
}
