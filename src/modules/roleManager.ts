import {Guild, GuildMember, Message, MessageReaction, Role, User} from "discord.js";
import Client from "../classes/Client";
import Model, {RoleManagerConfig} from "../objects/RoleManager";
import {fetchMessages} from "../utils";
import {Module} from "../classes/Module";
import Listener from "../classes/Listener";

async function getConfig(client: Client, guildId: string): Promise<RoleManagerConfig> {
    return await Model.findOne({guildId: guildId}) ?? await Model.create({guildId: guildId});
}

async function alterMembersRoles(member: GuildMember, newMemberRoleId: string, memberRoleId: string) {
    if (!member.roles.cache.has(newMemberRoleId)) return;

    if (!member.roles.cache.has(memberRoleId)) {
        const memberRole: Role | null = await member.guild.roles.fetch(memberRoleId);
        if (memberRole) {
            await member.roles.add(memberRole);
        }
    }

    const newMemberRole: Role | null = await member.guild.roles.fetch(newMemberRoleId);
    if (newMemberRole) {
        await member.roles.remove([newMemberRole]);
    }
}

async function onReady(client: Client) {
    const configs: Array<RoleManagerConfig> = await Model.find({});

    for (const config of configs) {
        if (!config.reactionListeningChannel || !config.reactionMessageIds.length) continue;
        const messages: Message[] | void = await fetchMessages(client, config.guildId, config.reactionListeningChannel, config.reactionMessageIds).catch(error => console.error(error));

        if (!messages) continue;
        const guild: Guild | null = await client.guilds.fetch(config.guildId);
        if (!guild) continue;

        const filter = (reaction: MessageReaction, _: User) => config.reactionMessageIds.includes(reaction.message.id);

        for (const message of messages) {
            for (const reaction of message.reactions.cache.values()) {
                await reaction.users.fetch();
                for (const user of reaction.users.cache.values()) {
                    try {
                        const member: GuildMember | null = await guild.members.fetch(user.id);
                        if (member) await this.alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }

            await message.reactions.removeAll();
            message.createReactionCollector({filter: filter}).on("collect", this.onReactionAdd);
        }
    }
}

async function onMemberJoin(member: GuildMember) {
    const config: RoleManagerConfig = await getConfig(member.client as Client, member.guild.id);

    if (!config.newUserRoleId) return;

    const newMemberRole: Role | null = await member.guild.roles.fetch(config.newUserRoleId);

    if (newMemberRole)
        await member.roles.add([newMemberRole], "Bot added.");
}

async function onReactionAdd(messageReaction: MessageReaction, user: User) {
    if (user.bot) return;
    const guild: Guild | null = messageReaction.message.guild;
    if (!guild) return;

    const member: GuildMember | null = await guild.members.fetch(user.id);
    if (!member) {
        console.error("How the actual... did a user that is not in the guild react to a message?");
        return;
    }

    const config: RoleManagerConfig = await this.getConfig(messageReaction.client as Client, guild.id);
    await this.alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);

    await messageReaction.remove();
}

class RoleManager extends Module {

    constructor() {
        super("RoleManager");

        this.listeners = [
            new Listener(client => client.on("guildMemberAdd", async member => {
                if (member.partial) await member.fetch();
                await onMemberJoin(member as GuildMember);
            })),
            new Listener(client => client.on("ready", async () => await onReady(client)))
        ];
    }
}

export default new RoleManager();
