var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { logger } from "../utils/logger";
import chalk from "chalk";
export class Task {
    static waitTillReady(client, checkAgainTime = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug(`Waiting for ${chalk.cyan("client")} to be ready.`, { context: "Task#WaitTillReady" });
            while (!client.isReady()) {
                yield new Promise(resolve => setTimeout(resolve, checkAgainTime));
            }
        });
    }
}
//# sourceMappingURL=task.js.map