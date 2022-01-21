"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const RoleManager_1 = __importDefault(require("../schema/RoleManager"));
const utils_1 = require("../utils");
const Module_1 = require("../classes/Module");
const Listener_1 = __importDefault(require("../classes/Listener"));
const Command_1 = __importDefault(require("../classes/Command"));
const builders_1 = require("@discordjs/builders");
async function getConfig(client, guildId) {
    return await RoleManager_1.default.findOne({ _id: guildId }) ?? await RoleManager_1.default.create({ _id: guildId });
}
async function alterMembersRoles(member, newMemberRoleId, memberRoleId) {
    if (!member.roles.cache.has(newMemberRoleId))
        return;
    if (!member.roles.cache.has(memberRoleId)) {
        const memberRole = await member.guild.roles.fetch(memberRoleId);
        if (memberRole) {
            await member.roles.add(memberRole);
        }
    }
    const newMemberRole = await member.guild.roles.fetch(newMemberRoleId);
    if (newMemberRole) {
        await member.roles.remove([newMemberRole]);
    }
}
async function onReady(client) {
    const configs = await RoleManager_1.default.find({});
    for (const config of configs) {
        if (!client.guilds.cache.has(config._id))
            continue;
        if (!config.reactionListeningChannel || !config.reactionMessageIds.length)
            continue;
        const messages = await (0, utils_1.fetchMessages)(client, config._id, config.reactionListeningChannel, config.reactionMessageIds).catch(error => console.error(error));
        if (!messages)
            continue;
        const guild = await client.guilds.fetch(config._id);
        if (!guild)
            continue;
        const filter = (reaction, _) => config.reactionMessageIds.includes(reaction.message.id);
        for (const message of messages) {
            for (const reaction of message.reactions.cache.values()) {
                await reaction.users.fetch();
                for (const user of reaction.users.cache.values()) {
                    try {
                        const member = await guild.members.fetch(user.id);
                        if (member)
                            await alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            }
            await message.reactions.removeAll();
            message.createReactionCollector({ filter: filter }).on("collect", onReactionAdd);
        }
    }
}
async function onMemberJoin(member) {
    const config = await getConfig(member.client, member.guild.id);
    if (!config.newUserRoleId)
        return;
    const newMemberRole = await member.guild.roles.fetch(config.newUserRoleId);
    if (newMemberRole)
        await member.roles.add([newMemberRole], "Bot added.");
}
async function onReactionAdd(messageReaction, user) {
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
    const config = await getConfig(messageReaction.client, guild.id);
    await alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);
    await messageReaction.remove();
}
async function sendButtons(interaction) {
    await interaction.reply({
        content: "yolo",
        components: [new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton().setCustomId("fish").setLabel("yolo2").setStyle("PRIMARY"))]
    });
}
class RoleManager extends Module_1.Module {
    constructor() {
        super("RoleManager");
        this.listeners = [
            new Listener_1.default(`${this.name}#OnGuildMemberAdd`, "guildMemberAdd", async (member) => {
                if (member.partial)
                    await member.fetch();
                await onMemberJoin(member);
            }),
            new Listener_1.default(`${this.name}#OnReady`, "ready", async (client) => await onReady(client))
        ];
        this.commands = [
            new Command_1.default(new builders_1.SlashCommandBuilder()
                .setName("gen_role_chooser")
                .setDescription("Displays the buff for the day."), sendButtons),
        ];
    }
}
exports.default = new RoleManager();
