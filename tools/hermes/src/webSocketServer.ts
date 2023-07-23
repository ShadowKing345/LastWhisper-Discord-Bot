import { APIGuildTextChannel, ChannelType } from "discord-api-types/payloads/v10";
import { ApplicationCommandOptionType, ApplicationCommandType, ApplicationFlags, GatewayDispatchEvents, GatewayHello, GatewayInteractionCreateDispatch, GatewayOpcodes, GatewayReadyDispatch, GuildMemberFlags, InteractionType } from "discord-api-types/v10";
import { RawData, WebSocket, WebSocketServer } from "ws";
import config from "./config.js";

interface BasePayload {
    op: GatewayOpcodes;
    d?: unknown;
    s: number;
    t?: string;
}

const helloResponse: GatewayHello = {
    op: GatewayOpcodes.Hello,
    d: { heartbeat_interval: 45000 },
    s: null, t: null,
};

const readyResponse: GatewayReadyDispatch = {
    s: 0,
    op: GatewayOpcodes.Dispatch,
    d: {
        v: 10,
        user: {
            id: "test",
            username: "Test user",
            discriminator: "3333",
            avatar: null,
            global_name: "test"
        },
        guilds: [],
        session_id: "133",
        resume_gateway_url: "/gateway/resume",
        application: {
            id: "test",
            flags: ApplicationFlags.ApplicationCommandBadge
        }
    },
    t: GatewayDispatchEvents.Ready
};

const interactionResponse: GatewayInteractionCreateDispatch = {
    s: 0,
    op: GatewayOpcodes.Dispatch,
    d: {
        channel_id: "",
        app_permissions: '',
        application_id: "test",
        channel: {} as APIGuildTextChannel<ChannelType.GuildText>,
        guild_id: "3",
        member: {
            user: {
                id: "3",
                username: "TestUser",
                avatar: "Test",
                discriminator: "1135",
                global_name: "test"
            },
            flags: GuildMemberFlags.CompletedOnboarding,
            roles: [],
            premium_since: null,
            permissions: "2147483647",
            pending: true,
            nick: null,
            mute: false,
            joined_at: "2017-03-13T19:19:14.040000+00:00",
            deaf: false
        },
        data: {
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "slash_command_test",
                },
            ],
            type: ApplicationCommandType.ChatInput,
            name: "dev",
            id: "771825006014889984"
        },
        id: "",
        locale: "en-US",
        token: "",
        type: InteractionType.ApplicationCommand,
        version: 1
    },
    t: GatewayDispatchEvents.InteractionCreate
}


export class FakeApiWebSocketServer {
    private ws?: WebSocketServer;

    private onConnect( socket: WebSocket ): void {
        console.log( "Client has connect to socket server." );
        this.attachSocket( socket );
        socket.send( JSON.stringify( helloResponse ) );
    }

    private onMessage( socket: WebSocket, message: RawData ): void {
        const data = JSON.parse( message.toString() ) as BasePayload;
        switch( data.op ) {
            case GatewayOpcodes.Identify:
                socket.send( JSON.stringify( readyResponse ) );
                break;
            case GatewayOpcodes.Heartbeat:
                socket.send( JSON.stringify( { op: GatewayOpcodes.HeartbeatAck, d: null } ) )
        }
    }

    private attach(): void {
        this.ws?.on( "connection", socket => this.onConnect( socket ) );
    }

    private attachSocket( socket: WebSocket ): void {
        socket.on( "message", message => {
            this.onMessage( socket, message );
        } );
    }

    public sendInteractionMessage( socket: WebSocket ) {
        socket.send( JSON.stringify( interactionResponse ) );
    }

    public connect() {
        this.ws = new WebSocketServer( { port: config.webSocketPort } );
        console.log( `Websocket server listening on port ${ config.webSocketPort }` );
        this.attach();
    }

    public disconnect() {
        console.log( "Disconnecting websocket server." );
        this.ws?.close();
        this.ws = undefined;
    }
}