import { appRouter } from './server/Routers';
import { 
    createContextStandalone,
    createContextLambda
} from './server/context';
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import WebSocket, { WebSocketServer } from 'ws';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { IncomingMessage } from 'http';
// import { Server } from 'socket.io';

const port = 4000;
const socketPort = 4001;

// standalone server
createHTTPServer({
    middleware: cors({
        origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost']
    }),
    router: appRouter,
    createContext: createContextStandalone
}).listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

// lambda function
export const handler = awsLambdaRequestHandler({
    router: appRouter,
    createContext: createContextLambda,
    responseMeta() {
        return {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Credentials": "true"
            },
        };
    },
})

//web socket
const wss = new WebSocketServer({ port: socketPort }, () => {
    console.log(`Websocket is listening on port ${socketPort}`)
});
let connections: { [key: string]: WebSocket } = {};
let users: { [key: string]: object } = {};
let socketIds: { [key: string]: string } = {};

const getConnections = () => {
    Object.keys(connections).forEach((uuid) => {
        const connection = connections[uuid];
        connection.send(JSON.stringify({ type: 'useronline', message: users }));
    });
};

const boardcast = (type:string, message: string) => {
    Object.keys(connections).forEach((uuid) => {
        const connection = connections[uuid];
        connection.send(JSON.stringify({ type, message }));
    });
};

const handleMessage = (data: { type: string, to: string, message: any }) => {
    switch(data.type) {
        case 'get_connections':
            getConnections();
            break;
        case 'private_message':
            if (data.to) {
                const socketId = socketIds[data.to];
                connections[socketId].send(JSON.stringify({ type: 'private_message', message: data.message }));
            }
            break;
        case 'public_message':
        case 'new_ticket':
            boardcast(data.type, data.message);
            break;
    }
};

const handleClose = (uuid: string) => {
    if (connections[uuid]) {
        connections[uuid].close();
    }
    delete connections[uuid];
    delete users[uuid];
    console.log('Close connection uuid: ' + uuid);
};

const addNewConnection = (uuid: string, ws: WebSocket, user: any) => {
    connections[uuid] = ws;
    users[uuid] = user;
    socketIds[user.id] = uuid;
};

wss.on('connection', function connection(ws: WebSocket, request: IncomingMessage) {
    const uuid = uuidv4();

    ws.onmessage = (event) => {
        const data: { type: string, to: string, message: any } = JSON.parse(event.data.toString());

        if (data.type == 'new_connection') {
            if (data.message.id) {
                addNewConnection(uuid, ws, data.message);
            }
        } else {
            handleMessage(data);
        }
    }
    ws.onclose = () => handleClose(uuid);
});
