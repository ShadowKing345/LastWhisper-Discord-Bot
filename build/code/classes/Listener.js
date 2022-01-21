"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Listener {
    constructor(name, event, run) {
        this.name = name;
        this.event = event;
        this.run = run;
    }
}
exports.default = Listener;
