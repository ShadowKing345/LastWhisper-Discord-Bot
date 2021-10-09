import Client from "./Client";

export default class Listener {
    run: (client: Client) => void;

    constructor(run: (client: Client) => void) {
        this.run = run;
    }
}