import chalk from "chalk";
import { pino } from "pino";

const colors = [ "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "gray", "grey", "blackBright", "redBright", "greenBright", "yellowBright", "blueBright", "magentaBright", "cyanBright", "whiteBright" ];
const logger = pino({
    name: "Fish",
    transport: {
        target: "pino-pretty",
    },
});

for (const color of colors) {
    logger.info(`Color ${chalk[color](color)}`);
}