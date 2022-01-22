"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
class Task {
    static async waitTillReady(client, checkAgainTime = 500) {
        while (!client.isReady()) {
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
        }
    }
}
exports.Task = Task;
