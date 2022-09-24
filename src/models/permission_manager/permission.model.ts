/**
 * Representation of a permission.
 */
export class Permission {
    public roles: string[] = [];
    public mode?: PermissionMode = PermissionMode.ANY;
    public blackList?: boolean = false;
}

// Modes for how permissions are handled.
export enum PermissionMode {
    ANY,
    STRICT,
}
