import mongoose from "mongoose";
import {AppConfigs} from "./configurations/appConfigs";

export default class ConfigManager {
    public static async establishDBConnection(appConfigs: AppConfigs) {
        if (!appConfigs.getDBUrl) throw new Error("No DB URL set!");
        console.log("Connecting to DB");
        await mongoose.connect(appConfigs.getDBUrl);
        console.log("Successfully Connected to DB");
    }
}
