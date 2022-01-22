"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleBase = void 0;
class ModuleBase {
    constructor() {
        this._moduleName = "";
        this._commands = [];
        this._listeners = [];
        this._tasks = [];
    }
    get moduleName() {
        return this._moduleName;
    }
    get commands() {
        return this._commands;
    }
    get listeners() {
        return this._listeners;
    }
    get tasks() {
        return this._tasks;
    }
}
exports.ModuleBase = ModuleBase;
