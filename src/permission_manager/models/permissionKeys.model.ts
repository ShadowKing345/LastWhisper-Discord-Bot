export interface PermissionKeys {
    $index: string,

    [key: string]: string | {
        $index: string,
        [key: string]: string
    }
}