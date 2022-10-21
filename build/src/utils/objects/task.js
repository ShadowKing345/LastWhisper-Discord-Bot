export class Task {
    // private static readonly logger = container.resolve(LoggerFactory).buildLogger(Task.name);
    name;
    timeout;
    run;
    static async waitTillReady(client, checkAgainTime = 500) {
        // Task.logger.debug(`Waiting for client to be ready.`);
        while (!client.isReady()) {
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
        }
        // Task.logger.debug(`Client is ready.`);
    }
}
//# sourceMappingURL=task.js.map