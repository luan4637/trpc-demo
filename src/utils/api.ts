import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { AppRouter } from '../server/Routers'
import getAuth from './getAuth';
import { EventEmitter } from 'events';

let token: string;
let apiURL: string = 'http://localhost:4000/';

export const eventEmitter = new EventEmitter();

export function setToken(newToken: string, refreshToken?: string) {
    token = newToken;
    localStorage.setItem('token', token);
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }
}

export const api = createTRPCNext<AppRouter>({
    config(opts) {

        
        return {
            links: [
                httpBatchLink({
                    url: apiURL,
                    headers() {
                        if (!token) {
                            token = localStorage.getItem('token') ?? '';
                        }

                        return {
                            Authorization: 'Bearer ' + token
                        }
                    },
                    fetch: async (url, options): Promise<Response> => {
                        let res = await fetch(url, options);
                        
                        if (res.status === 401) {
                            const resToken = await fetch(apiURL + 'token', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    // 'Access-Control-Allow-Origin': '*',
                                    'Authorization': 'Bearer ' + (localStorage.getItem('refreshToken') ?? '')
                                }
                            });
                            
                            if (resToken.status === 200) {
                                const { result } = await resToken.json();
                                setToken(result.data.token);
                            } else {
                                location.href = '/login';
                            }
                        }

                        return res;
                    }
                }),
                
            ],
        }
    },
    ssr: false,
});


export const webSocket = new WebSocket('ws://localhost:4001');
webSocket.onopen = async (event) => {
    console.log('client connected');
    let user = {};
    try {
        user = await getAuth();
    } catch (e) {
        
    }
    webSocket.send(JSON.stringify({ type: 'new_connection', message: user }));
};

webSocket.onmessage = (event) => {
    const { type, message } = JSON.parse(event.data);
    
    switch(type) {
        case 'useronline':
            eventEmitter.emit('useronline', message);
            break;
        case 'private_message':
            eventEmitter.emit('private_message', message);
            break;
        case 'public_message':
            eventEmitter.emit('public_message', message);
            break;
        case 'new_ticket':
            eventEmitter.emit('new_ticket', message);
            break;
    }
};
