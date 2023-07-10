import { runHttpServer } from "./httpServer.js";
import { FakeApiWebSocketServer } from "./webSocketServer.js";

const webSocketServer = new FakeApiWebSocketServer();
webSocketServer.connect();
const httpServer = runHttpServer();

function stop() {
    console.log( "Exiting" );
    webSocketServer.disconnect();
    httpServer.close();
}

// process.on( "exit", stop );
process.on( "SIGINT", stop );
process.on( "SIGTERM", stop );