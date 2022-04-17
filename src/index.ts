import { main } from "./app.js";
import { logger } from "./utils/logger.js";

try {
    await main();
} catch (error) {
    logger.error(error);
}
