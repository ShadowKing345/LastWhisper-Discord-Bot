export class Timer {
    name = null;
    timeout = null;
    execute = null;
    static async waitTillReady(client, checkAgainTime = 500) {
        while (!client.isReady()) {
            await new Promise((resolve) => setTimeout(resolve, checkAgainTime));
        }
    }
}
//# sourceMappingURL=timer.js.map