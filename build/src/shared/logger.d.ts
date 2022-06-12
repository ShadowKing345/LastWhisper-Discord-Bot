export declare enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error"
}
export declare function buildLogger(name: string): import("pino").Logger<{
    name: string;
    level: string;
    transport: {
        target: string;
        options: {
            translateTime: string;
            ignore: string;
        };
    };
}>;
//# sourceMappingURL=logger.d.ts.map