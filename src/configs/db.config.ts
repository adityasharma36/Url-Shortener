
import mongoose from "mongoose";
import { serverConfig } from "./index.js";
import { logger } from "./logger.config.js";

export async function connnectToDB(){
    try {
    await mongoose.connect(serverConfig.MONGO_URL);
    logger.info("Db has been connected to system")
    } catch (error) {
        logger.error("Db has not able to connect with system")
    }
}