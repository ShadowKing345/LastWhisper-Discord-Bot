var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MessageActionRow, MessageButton } from "discord.js";
import { fetchMessages } from "../utils/utils.js";
import { ModuleBase } from "../classes/moduleBase.js";
import { RoleManagerConfigService } from "../services/roleManagerConfigService.js";
export class RoleManagerModule extends ModuleBase {
    constructor() {
        super();
        this.service = new RoleManagerConfigService();
        this._moduleName = "RoleManager";
        this._listeners = [
            { event: "guildMemberAdd", run: (_, member) => __awaiter(this, void 0, void 0, function* () { return this.onMemberJoin(member); }) },
            { event: "ready", run: (client) => __awaiter(this, void 0, void 0, function* () { return this.onReady(client); }) }
        ];
        this._commands = [
            {
                command: builder => builder.setName("gen_role_chooser").setDescription("Displays the buff for the day."),
                run: (interaction) => __awaiter(this, void 0, void 0, function* () { return this.sendButtons(interaction); })
            }
        ];
    }
    getConfig(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.findOneOrCreate(guildId);
        });
    }
    static alterMembersRoles(member, newMemberRoleId, memberRoleId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!member.roles.cache.has(newMemberRoleId))
                return;
            if (!member.roles.cache.has(memberRoleId)) {
                const memberRole = yield member.guild.roles.fetch(memberRoleId);
                if (memberRole) {
                    yield member.roles.add(memberRole);
                }
            }
            const newMemberRole = yield member.guild.roles.fetch(newMemberRoleId);
            if (newMemberRole) {
                yield member.roles.remove([newMemberRole]);
            }
        });
    }
    onReady(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const configs = yield this.service.getAll();
            for (const config of configs) {
                if (!client.guilds.cache.has(config.guildId))
                    continue;
                if (!config.reactionListeningChannel || !config.reactionMessageIds.length)
                    continue;
                const messages = yield fetchMessages(client, config.guildId, config.reactionListeningChannel, config.reactionMessageIds).catch(error => console.error(error));
                if (!messages)
                    continue;
                const guild = yield client.guilds.fetch(config.guildId);
                if (!guild)
                    continue;
                const filter = (reaction, _) => config.reactionMessageIds.includes(reaction.message.id);
                for (const message of messages) {
                    for (const reaction of message.reactions.cache.values()) {
                        yield reaction.users.fetch();
                        for (const user of reaction.users.cache.values()) {
                            try {
                                const member = yield guild.members.fetch(user.id);
                                if (member)
                                    yield RoleManagerModule.alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);
                            }
                            catch (error) {
                                console.error(error);
                            }
                        }
                    }
                    yield message.reactions.removeAll();
                    message.createReactionCollector({ filter: filter }).on("collect", (message, user) => this.onReactionAdd(message, user));
                }
            }
        });
    }
    onMemberJoin(member) {
        return __awaiter(this, void 0, void 0, function* () {
            if (member.partial)
                yield member.fetch();
            const config = yield this.getConfig(member.guild.id);
            if (!config.newUserRoleId)
                return;
            const newMemberRole = yield member.guild.roles.fetch(config.newUserRoleId);
            if (newMemberRole) {
                yield member.roles.add([newMemberRole], "Bot added.");
            }
        });
    }
    onReactionAdd(messageReaction, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.bot)
                return;
            const guild = messageReaction.message.guild;
            if (!guild)
                return;
            const member = yield guild.members.fetch(user.id);
            if (!member) {
                console.error("How the actual... did a user that is not in the guild react to a message?");
                return;
            }
            const config = yield this.getConfig(guild.id);
            yield RoleManagerModule.alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);
            yield messageReaction.remove();
        });
    }
    sendButtons(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.reply({
                content: "yolo",
                components: [new MessageActionRow().addComponents(new MessageButton().setCustomId("fish").setLabel("yolo2").setStyle("PRIMARY"))]
            });
        });
    }
}
//# sourceMappingURL=roleManagerModule.js.map