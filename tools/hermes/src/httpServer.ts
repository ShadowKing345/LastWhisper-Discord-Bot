import express, { Request, Response } from "express";
import config from "./config.js";

const httpServer = express();

httpServer.get( "/gateway", ( req: Request, res: Response ) => {
    res.writeHead( 200, { "Content-Type": "application/json" } );
    res.write( JSON.stringify( {
        url: `ws://localhost:${ config.webSocketPort }`,
        shards: [],
        session_start_limit: 10
    } ) );
    res.end();
} );

httpServer.get( "*", ( req: Request, res: Response ) => {
    console.log(req.url);
    res.writeHead( 200 );
    res.write( "Page not found." );
    res.end();
} );

export function runHttpServer() {
    return httpServer.listen( config.httpPort, () => console.log( `Http Server listening on port ${ config.httpPort };` ) );
}