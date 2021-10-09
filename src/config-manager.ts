import mongoose from "mongoose";

export default class ConfigManager {
    db_Url: string | undefined;

    constructor() {
        this.db_Url = process.env.DB_URL;
    }

    async loadConfigs() {
        if (!this.db_Url) return;
        try {
            await mongoose.connect(this.db_Url);
            console.log("Connected To DB");
        } catch (error) {
            console.error(error);
        }
    }
}
