export interface PermissionKeysType {
    $index: string,

    [key: string]: string | {
        $index: string,
        [key: string]: string
    }
}