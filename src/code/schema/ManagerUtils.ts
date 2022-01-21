import mongoose from "mongoose";
import {ManagerUtilConfig} from "../objects/MangerUtils";

const schema = new mongoose.Schema<ManagerUtilConfig>({
    _id: String,
    loggingChannel: String,
    clearChannelBlacklist:Array
});

export default mongoose.model<ManagerUtilConfig>("ManagerUtil", schema);

