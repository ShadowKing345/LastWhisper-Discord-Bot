import { Role, InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { PermissionManagerRepository } from "../repositories/permissionManager.repository.js";
export declare class PermissionManagerService {
    private permissionManagerRepository;
    private logger;
    private static readonly keys;
    private static _keysFormatted;
    constructor(permissionManagerRepository: PermissionManagerRepository, logger: pino.Logger);
    isAuthorized(interaction: ChatInputCommandInteraction, key: string): Promise<boolean>;
    addRole(interaction: ChatInputCommandInteraction, key: string, role: Role): Promise<InteractionResponse>;
    removeRole(interaction: ChatInputCommandInteraction, key: string, role: Role): Promise<InteractionResponse>;
    config(interaction: ChatInputCommandInteraction, key: string): Promise<InteractionResponse>;
    reset(interaction: ChatInputCommandInteraction, key: string): Promise<InteractionResponse>;
    listPermissions(interaction: ChatInputCommandInteraction, key?: string): Promise<InteractionResponse>;
    private findOneOrCreate;
    static addPermissionKey(key: string): void;
    static removePermissionKey(key: string): void;
    static keyExists(key: string): boolean;
    static get keysFormatted(): string;
    private static validateKey;
}
//# sourceMappingURL=permissionManager.service.d.ts.map