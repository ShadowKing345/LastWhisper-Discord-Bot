"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Task {
    constructor(name, timeout, run) {
        this.name = name;
        this.timeout = timeout;
        this.run = run;
    }
    static async waitTillReady(client, checkAgainTime = 500) {
        while (!client.isReady)
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
    }
}
exports.default = Task;
