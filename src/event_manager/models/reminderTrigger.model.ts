export class ReminderTrigger {
    public message: string = null;
    public timeDelta: string = null;

    constructor(message: string, timeDelta: string) {
        this.message = message;
        this.timeDelta = timeDelta;
    }
}