import chalk from "chalk";
import { logger } from "../utils/logger.js";
export class Task {
    name;
    timeout;
    run;
    static async waitTillReady(client, checkAgainTime = 500) {
        logger.debug(`Waiting for ${chalk.cyan("client")} to be ready.`, { context: "Task#WaitTillReady" });
        while (!client.isReady()) {
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
        }
    }
}
//# sourceMappingURL=task.js.map