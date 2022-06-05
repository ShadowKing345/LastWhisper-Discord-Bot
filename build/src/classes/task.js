import chalk from "chalk";
import { buildLogger } from "../utils/logger.js";
export class Task {
    static logger = buildLogger(Task.name);
    name;
    timeout;
    run;
    static async waitTillReady(client, checkAgainTime = 500) {
        Task.logger.debug(`Waiting for ${chalk.cyan("client")} to be ready.`, { context: "Task#WaitTillReady" });
        while (!client.isReady()) {
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
        }
    }
}
//# sourceMappingURL=task.js.map