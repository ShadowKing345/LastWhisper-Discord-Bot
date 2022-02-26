export class ModuleBase {
    constructor() {
        this._moduleName = "";
        this._commands = [];
        this._listeners = [];
        this._tasks = [];
    }
    get moduleName() {
        return this._moduleName;
    }
    get command() {
        return this._command;
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
//# sourceMappingURL=moduleBase.js.map