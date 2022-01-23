import {
    CommandInteraction,
    Guild,
    GuildMember,
    Message,
    MessageActionRow,
    MessageButton,
    MessageReaction,
    Role,
    User
} from "discord.js";
import {RoleManagerConfig} from "../models/roleManager";
import {fetchMessages} from "../utils";
import {SlashCommandBuilder} from "@discordjs/builders";
import {ModuleBase} from "../classes/moduleBase";
import {Client} from "../classes/client";
import {RoleManagerConfigService} from "../services/roleManagerConfigService";
import {Service} from "typedi";

@Service()
export class RoleManagerModule extends ModuleBase {

    constructor(private service: RoleManagerConfigService) {
        super();

        this._moduleName = "RoleManager";
        this._listeners = [
            {event: "guildMemberAdd", run: this.onMemberJoin},
            {event: "ready", run: this.onReady}
        ];

        this._commands = [
            {
                command: new SlashCommandBuilder()
                    .setName("gen_role_chooser")
                    .setDescription("Displays the buff for the day."),
                run: RoleManagerModule.sendButtons
            }
        ];
    }

    private async getConfig(guildId: string): Promise<RoleManagerConfig> {
        return this.service.findOneOrCreate(guildId);
    }

    private static async alterMembersRoles(member: GuildMember, newMemberRoleId: string, memberRoleId: string) {
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

    private async onReady(client: Client) {
        const configs: RoleManagerConfig[] = await this.service.getAll();

        for (const config of configs) {
            if (!client.guilds.cache.has(config.guildId)) continue;
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
                            if (member) await RoleManagerModule.alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);
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

    private async onMemberJoin(_, member: GuildMember) {
        if (member.partial) await member.fetch();
        const config: RoleManagerConfig = await this.getConfig(member.guild.id);

        if (!config.newUserRoleId) return;

        const newMemberRole: Role | null = await member.guild.roles.fetch(config.newUserRoleId);

        if (newMemberRole) {
            await member.roles.add([newMemberRole], "Bot added.");
        }
    }

    private async onReactionAdd(messageReaction: MessageReaction, user: User) {
        if (user.bot) return;
        const guild: Guild | null = messageReaction.message.guild;
        if (!guild) return;

        const member: GuildMember | null = await guild.members.fetch(user.id);
        if (!member) {
            console.error("How the actual... did a user that is not in the guild react to a message?");
            return;
        }

        const config: RoleManagerConfig = await this.getConfig(guild.id);
        await RoleManagerModule.alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);

        await messageReaction.remove();
    }

    private static async sendButtons(interaction: CommandInteraction) {
        await interaction.reply({
            content: "yolo",
            components: [new MessageActionRow().addComponents(new MessageButton().setCustomId("fish").setLabel("yolo2").setStyle("PRIMARY"))]
        });
    }
}