import {createServer, IncomingMessage, Server, ServerResponse} from "http";

export class Healthcheck {
    private readonly server: Server;

    public constructor() {
        this.server = createServer();
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.server.on("request", async (req, res) => this.processRequest(req, res));
    }
    
    public run(): Promise<void> {
        return new Promise<void>(resolve => {
            this.server.listen(8080, () => {
                console.log("Listening on port 8080.");
                resolve();
            });
        });
    }

    public stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                console.log("Closing Healthcheck server.")
                resolve();
            });
        });
    }

    private processRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
        if (req.url !== "/health") {
            res.writeHead(404);
        } else {
            res.writeHead(200);
            res.write("Done");
        }
        res.end();
        
        return Promise.resolve();
    }
}