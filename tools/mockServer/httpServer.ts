import { createServer } from "http";
import config from "./config.js";

export function runHttpServer() {
    const apiServer = createServer( ( req, res ) => {
        console.log( "Something is trying to connect" );
        console.log( req.url );

        res.writeHead( 200, { "Content-Type": "application/json" } );
        res.write( JSON.stringify( {
            url: `ws://localhost:${ config.webSocketPort }`,
            shards: [],
            session_start_limit: 10
        } ) );
        return res.end();
    } )

    return apiServer.listen( config.httpPort );
}