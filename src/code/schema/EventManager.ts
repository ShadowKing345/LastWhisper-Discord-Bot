import mongoose from "mongoose";
import {EventManagerConfig} from "../objects/EventManager";

const schema = new mongoose.Schema<EventManagerConfig>({
    _id: String,
    listenerChannelId: {type: String, default: ""},
    postingChannelId: {type: String, default: ""},
    delimiterCharacters: {
        type: Array,
        default: ["\\[", "\\]"]
    },
    tags: Object,
    dateTimeFormat: Array,
    events: Array,
    reminders: Array
});

export default mongoose.model<EventManagerConfig>("EventManager", schema);