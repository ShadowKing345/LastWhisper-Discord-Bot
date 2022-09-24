export class Permission {
    public roles: string[] = [];
    public mode?: PermissionMode = PermissionMode.ANY;
    public blackList?: boolean = false;
}

export enum PermissionMode {
    ANY,
    STRICT,
}
