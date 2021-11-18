import mongoose from "mongoose";
import {BuffManagerConfig, MessageSettings} from "../objects/BuffManager";

const schema = new mongoose.Schema<BuffManagerConfig>({
    _id: String,
    messageSettings: {
        type: Object,
        default: new MessageSettings
    },
    days: Array,
    weeks: Array
});

export default mongoose.model<BuffManagerConfig>("BuffManager", schema);