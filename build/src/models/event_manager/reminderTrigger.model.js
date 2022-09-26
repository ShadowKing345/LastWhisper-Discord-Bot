/**
 * Reminder trigger. Used to calculate how long until an event reminder needs to be sent.
 */
export class ReminderTrigger {
    message = null;
    timeDelta = null;
    constructor(message, timeDelta) {
        this.message = message;
        this.timeDelta = timeDelta;
    }
}
//# sourceMappingURL=reminderTrigger.model.js.map