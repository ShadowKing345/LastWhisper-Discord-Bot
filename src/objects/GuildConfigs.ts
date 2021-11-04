import mongoose from "mongoose";

const {Schema} = mongoose;

interface GuildConfig {
    _id: string;
    prefix: string;
}

const schema = new Schema<GuildConfig>(
    {
        _id: String,
        prefix: {
            type: String,
            required: true
        }
    });

const Model = mongoose.model<GuildConfig>("guildConfig", schema);

export default Model;
export {GuildConfig};
