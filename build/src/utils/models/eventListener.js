/**
 * A representation of an event listener for a module.
 */
export class EventListener {
    // The name of the event to listen to.
    event;
    // Function to be called when the event is executed.
    run;
    constructor(event = null, run = null) {
        this.event = event;
        this.run = run;
    }
}
//# sourceMappingURL=eventListener.js.map