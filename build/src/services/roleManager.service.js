var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RoleManagerService_1;
import { injectable } from "tsyringe";
import { RoleManagerConfig } from "../models/roleManager.model.js";
import { RoleManagerConfigRepository } from "../repositories/roleManagerConfig.repository.js";
import { fetchMessages } from "../utils/utils.js";
let RoleManagerService = RoleManagerService_1 = class RoleManagerService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    static async alterMembersRoles(member, roleId) {
        if (member.roles.cache.has(roleId)) {
            return;
        }
        const role = await member.guild.roles.fetch(roleId);
        if (role) {
            await member.roles.add(role);
        }
    }
    async getConfig(guildId) {
        return this.findOneOrCreate(guildId);
    }
    async onReady(client) {
        const configs = await this.repo.getAll();
        for (const config of configs) {
            if (!client.guilds.cache.has(config.guildId))
                continue;
            if (!config.reactionListeningChannel || !config.reactionMessageIds.length)
                continue;
            const messages = await fetchMessages(client, config.guildId, config.reactionListeningChannel, config.reactionMessageIds).catch(error => console.error(error));
            if (!messages)
                continue;
            const guild = await client.guilds.fetch(config.guildId);
            if (!guild)
                continue;
            const filter = (reaction) => config.reactionMessageIds.includes(reaction.message.id);
            for (const message of messages) {
                for (const reaction of message.reactions.cache.values()) {
                    await reaction.users.fetch();
                    for (const user of reaction.users.cache.values()) {
                        try {
                            const member = await guild.members.fetch(user.id);
                            if (member)
                                await RoleManagerService_1.alterMembersRoles(member, config.acceptedRole);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }
                await message.reactions.removeAll();
                message.createReactionCollector({ filter }).on("collect", (messageReaction, user) => this.onReactionAdd(messageReaction, user));
            }
        }
    }
    async onReactionAdd(messageReaction, user) {
        if (user.bot)
            return;
        const guild = messageReaction.message.guild;
        if (!guild)
            return;
        const member = await guild.members.fetch(user.id);
        if (!member) {
            console.error("How the actual... did a user that is not in the guild react to a message?");
            return;
        }
        const config = await this.getConfig(guild.id);
        await RoleManagerService_1.alterMembersRoles(member, config.acceptedRole);
        await messageReaction.remove();
    }
    async findOneOrCreate(id) {
        let result = await this.repo.findOne({ guildId: id });
        if (result)
            return result;
        result = new RoleManagerConfig();
        result.guildId = id;
        return await this.repo.save(result);
    }
};
RoleManagerService = RoleManagerService_1 = __decorate([
    injectable(),
    __metadata("design:paramtypes", [RoleManagerConfigRepository])
], RoleManagerService);
export { RoleManagerService };
//# sourceMappingURL=roleManager.service.js.map