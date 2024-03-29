import { Guild, GuildBan, GuildMember, TextChannel, User, InteractionResponse, ChatInputCommandInteraction, AuditLogEvent, EmbedBuilder, PartialGuildMember } from "discord.js";
import { DateTime } from "luxon";

import { ManagerUtilsConfig } from "../entities/managerUtils.js";
import { ManagerUtilsRepository } from "../repositories/managerUtils.js";
import { Service } from "./service.js";
import { service } from "../decorators/index.js";

/**
 * Service used to provide some basic manager utilities.
 */
@service()
export class ManagerUtilsService extends Service {
    private readonly repository: ManagerUtilsRepository;

    constructor( repository: ManagerUtilsRepository ) {
        super();

        this.repository = repository;
    }

    /**
     * Returns the logging channel.
     * @param guild
     * @private
     */
    private async getLoggingChannel( guild: Guild ): Promise<TextChannel> {
        const config: ManagerUtilsConfig = await this.repository.findOneOrCreateByGuildId( guild.id );
        const channel = await guild.channels.fetch( config.loggingChannel );

        if( !channel ) {
            return null;
        }

        if( !channel.isTextBased ) {
            return null;
        }

        return channel as TextChannel;
    }

    /**
     * Sends a message when a member was removed from the discord server.
     * @param member
     */
    public async onMemberRemoved( member: GuildMember | PartialGuildMember ) {
        if( member.partial ) {
            await member.fetch();
        }
        
        console.log(member);

        const loggingChannel: TextChannel | null = await this.getLoggingChannel( member.guild );
        if( !loggingChannel ) return;

        const kickedData = (
            await member.guild.fetchAuditLogs( {
                limit: 1,
                type: AuditLogEvent.MemberKick,
            } )
        ).entries.first();

        const embed = new EmbedBuilder()
            .setColor( "Random" )
            .addFields(
                {
                    name: "Joined On:",
                    value: DateTime.fromJSDate( member.joinedAt ).toFormat( "HH:mm:ss DD/MM/YYYY" ),
                },
                { name: "Nickname was:", value: member.nickname ?? "None" },
                {
                    name: "Roles:",
                    value: member.roles.cache.map( role => role.toString() ).join( " " ),
                },
            )
            .setThumbnail( member.user.displayAvatarURL() );

        if( kickedData && kickedData.target.id === member.id ) {
            embed
                .setTitle( "User Kicked!" )
                .setDescription(
                    `User **${ member.user.username }** was kicked by **${
                        ( await member.guild.members.fetch( kickedData.executor.id ) ).displayName
                    }** from the server.`,
                );
        } else {
            embed.setTitle( "User Left!" ).setDescription( `User **${ member.user.username }** has left this discord server` );
        }

        await loggingChannel.send( { embeds: [ embed ] } );
    }

    /**
     * Creates a message when the user has been banned from the server.
     * @param ban
     */
    public async onMemberBanned( ban: GuildBan ) {
        const loggingChannel: TextChannel = await this.getLoggingChannel( ban.guild );
        if( !loggingChannel ) return;

        const banLogs = (
            await ban.guild.fetchAuditLogs( {
                limit: 1,
                type: AuditLogEvent.MemberBanAdd,
            } )
        ).entries.first();

        if( banLogs ) {
            const executor: User | null = banLogs.executor;
            const target: User | null = banLogs.target;

            const embed = new EmbedBuilder().setTitle( "Member Banned!" ).setColor( "Random" );

            if( target ) {
                embed
                    .setDescription(
                        `User **${ target.tag }** was banned by ${
                            executor
                                ? ( await ban.guild.members.fetch( executor.id ) ).displayName
                                : "Someone who was not part of the server somehow... what how?? "
                        }!`,
                    )
                    .setThumbnail( target.displayAvatarURL() );
            } else {
                embed.setDescription( "Somehow a user was banned but we cannot find out who it was!" );
            }

            await loggingChannel.send( { embeds: [ embed ] } );
        } else {
            await loggingChannel.send( "A ban somehow occurred but no logs about it could be found!" );
        }
    }

    /**
     * Clears a channel of its messages.
     * @param interaction
     */
    public async clearChannelMessages( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        const config = await this.repository.findOneOrCreateByGuildId( interaction.guildId );

        if( config.clearChannelBlacklist.includes( interaction.channelId ) ) {
            return interaction.reply( {
                content:
                    "Wo hold it. No! Sorry this channel was blacklisted from the clear command to prevent accidental deletion.",
                ephemeral: true,
            } );
        }

        await interaction.deferReply( { ephemeral: true } );

        const all = interaction.options.getBoolean( "all" );
        let amount: number = all ? 1000 : interaction.options.getNumber( "amount" ) ?? 10;

        let amountDeleted = 0;
        for( amount; amount > 0; amount -= 100 ) {
            const messages = await ( interaction.channel as TextChannel ).messages.fetch( { limit: Math.min( amount, 100 ) } );

            for( const message of messages.values() ) {
                await message.delete();
            }

            amountDeleted += messages.size;

            if( messages.size !== 100 ) {
                break;
            }
        }

        await interaction.editReply( {
            content: `Done. Deleted **${ amountDeleted }** messages.`,
        } );
    }
}
