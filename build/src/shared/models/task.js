import { container } from "tsyringe";
import { classes, event } from "../logger/colors.js";
import { LoggerFactory } from "../logger/logger.js";
export class Task {
    static logger = container.resolve(LoggerFactory).buildLogger(Task.name);
    name;
    timeout;
    run;
    static async waitTillReady(client, checkAgainTime = 500) {
        Task.logger.debug(`${event("Waiting")} for ${classes("client")} to be ready.`);
        while (!client.isReady()) {
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
        }
        Task.logger.debug(`${classes("Client")} is ready.`);
    }
}
//# sourceMappingURL=task.js.map