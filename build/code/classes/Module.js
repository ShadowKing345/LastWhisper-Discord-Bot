"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
class Module {
    constructor(name) {
        this.name = name;
        this.commands = [];
        this.listeners = [];
        this.tasks = [];
    }
}
exports.Module = Module;
