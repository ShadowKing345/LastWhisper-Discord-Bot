import {Plot} from "../objects/gardening";

export default class GardeningConfiguration {
    public _id: string;
    public plots: Plot[] = [];
    public eventPostingChannel: string;
}