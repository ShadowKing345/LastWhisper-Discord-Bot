var PermissionManagerService_1;
import { __decorate, __metadata, __param } from "tslib";
import { pino } from "pino";
import { createLogger } from "../utils/loggerService.js";
import { Permission, PermissionManagerConfig, PermissionMode } from "../entities/permission_manager/index.js";
import { PermissionManagerRepository } from "../repositories/permissionManager.js";
import { unFlattenObject } from "../utils/index.js";
import { InvalidArgumentError, BadAuthorizationKeyError, DecoratorError } from "../utils/errors/index.js";
import { Service } from "../utils/objects/service.js";
import { service } from "../utils/decorators/index.js";
let PermissionManagerService = PermissionManagerService_1 = class PermissionManagerService extends Service {
    logger;
    static keys = [];
    static _keysFormatted = null;
    constructor(repository, logger) {
        super(repository, PermissionManagerConfig);
        this.logger = logger;
    }
    async getPermission(guildId, key) {
        return (await this.getConfig(guildId)).permissions[key];
    }
    async setPermission(guildId, key, permission) {
        const config = await this.getConfig(guildId);
        config.permissions[key] = permission;
        return (await this.repository.save(config)).permissions[key];
    }
    async isAuthorized(interaction, key) {
        if (!PermissionManagerService_1.keyExists(key)) {
            this.logger.debug("Key did not exist. Exiting out.");
            await interaction.reply({
                content: "The authorization key for the command could not be found.\nThis is a critical error and the developer of the application should be informed.\nKindly create an issue on the github page and indicate the command you were trying to use as well as the options.",
                ephemeral: true,
            });
            return false;
        }
        this.logger.debug(`Attempting to authorize for key ${key}`);
        if (!interaction) {
            this.logger.error("An interaction was null that should not be. Throwing.");
            throw new InvalidArgumentError("Interaction was null. This is not allowed.");
        }
        if (interaction.guild?.ownerId === interaction.user.id) {
            this.logger.debug("User is owner. Returning true.");
            return true;
        }
        const permission = await this.getPermission(interaction.guildId, key);
        if (!permission) {
            this.logger.debug("Permissions do not exist. Defaulting to true.");
            return true;
        }
        let result;
        if (permission.roles.length === 0) {
            this.logger.debug(`Length is 0. Flag set to true.`);
            result = true;
        }
        else {
            const user = await interaction.guild?.members.fetch(interaction.user.id);
            if (!user) {
                throw new Error("This user is not within the guild.");
            }
            switch (permission.mode) {
                case PermissionMode.STRICT:
                    result = user.roles.cache.hasAll(...permission.roles);
                    break;
                case PermissionMode.ANY:
                default:
                    result = user.roles.cache.hasAny(...permission.roles);
                    break;
            }
        }
        const authorized = (!permission.blackList && result) || (permission.blackList && !result);
        this.logger.debug(`User is ${authorized ? "Authenticated" : "Unauthenticated"}.`);
        return authorized;
    }
    static addPermissionKey(key) {
        if (!PermissionManagerService_1.keyExists(key)) {
            PermissionManagerService_1.keys.push(key);
            this._keysFormatted = null;
        }
    }
    static removePermissionKey(key) {
        if (PermissionManagerService_1.keyExists(key)) {
            PermissionManagerService_1.keys.splice(PermissionManagerService_1.keys.indexOf(key), 1);
            this._keysFormatted = null;
        }
    }
    static keyExists(key) {
        return PermissionManagerService_1.keys.includes(key);
    }
    static get keysFormatted() {
        if (PermissionManagerService_1._keysFormatted) {
            return PermissionManagerService_1._keysFormatted;
        }
        const obj = unFlattenObject(PermissionManagerService_1.keys.reduce((p, c) => ({ ...p, [c]: c }), {}));
        function format(obj, index = 0) {
            const spaces = "\t".repeat(index);
            let result = "";
            for (const [key, value] of Object.entries(obj)) {
                result +=
                    typeof value === "object" ? `${spaces}${key}:\n${format(value, index + 1)}` : `${spaces}${key};\n`;
            }
            return result;
        }
        return (PermissionManagerService_1._keysFormatted = format(obj));
    }
    static validateKey(index) {
        return function (_target, _property, descriptor) {
            const originalMethod = descriptor.value;
            descriptor.value = function (...args) {
                const key = args[index];
                if (!(key && typeof key === "string")) {
                    this.logger.error("Argument index resulted in null or not a string.");
                    throw new DecoratorError("Argument index resulted in null or not a string.");
                }
                if (PermissionManagerService_1.keyExists(key)) {
                    return originalMethod.apply(this, args);
                }
                this.logger.debug("Key did not exist. Exiting out.");
                throw new BadAuthorizationKeyError("Cannot find key. Please input a correct key. Use the list command to find out which keys are available.");
            };
            return descriptor;
        };
    }
};
__decorate([
    PermissionManagerService_1.validateKey(1),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PermissionManagerService.prototype, "getPermission", null);
__decorate([
    PermissionManagerService_1.validateKey(1),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Permission]),
    __metadata("design:returntype", Promise)
], PermissionManagerService.prototype, "setPermission", null);
PermissionManagerService = PermissionManagerService_1 = __decorate([
    service(),
    __param(1, createLogger(PermissionManagerService_1.name)),
    __metadata("design:paramtypes", [PermissionManagerRepository, Object])
], PermissionManagerService);
export { PermissionManagerService };
//# sourceMappingURL=permissionManager.js.map