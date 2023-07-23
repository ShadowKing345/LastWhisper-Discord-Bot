export class FakeDiscordApiServerConfig {
    public readonly httpPort: number = 8081;
    public readonly webSocketPort: number = 8082;
}

export default new FakeDiscordApiServerConfig();