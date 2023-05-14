import {Command} from "./command.js";

export class ContextMenuCommand extends Command {
    public constructor(data: Partial<ContextMenuCommand> = null) {
        super();
        
        if (data){
            this.merge(data);
        }
    }
}