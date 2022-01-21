import {Schema, model} from "mongoose";
import GardeningModule from "../configurations/gardeningModule";

const schema = new Schema<GardeningModule>({
    _id: String,
    plots: Array,
    eventPostingChannel: String,
});
export default model<GardeningModule>("GardeningManager", schema);