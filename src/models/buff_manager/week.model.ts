import { Days } from "./days.model.js";

export class Week {
    public isEnabled: boolean;
    public title: string;
    public days: Days = new Days();
}