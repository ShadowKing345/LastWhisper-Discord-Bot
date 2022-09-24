/**
 * Type definition for a permission type.
 */
export type PermissionKeysType = {
    $index: string,
    [key: string]: string | {
        $index: string,
        [key: string]: string
    }
} | string;
