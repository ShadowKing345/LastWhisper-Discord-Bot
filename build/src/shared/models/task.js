import { container } from "tsyringe";
import { LoggerFactory } from "../logger/logger.js";
export class Task {
    static logger = container.resolve(LoggerFactory).buildLogger(Task.name);
    name;
    timeout;
    run;
    static async waitTillReady(client, checkAgainTime = 500) {
        Task.logger.debug(`Waiting for client to be ready.`);
        while (!client.isReady()) {
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
        }
        Task.logger.debug(`Client is ready.`);
    }
}
//# sourceMappingURL=task.js.map