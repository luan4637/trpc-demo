import { useEffect, useState } from "react";
import { webSocket, eventEmitter } from "../utils/api"
import FormMessage from "./FormMessage";
import getAuth, { authUser } from "../utils/getAuth";

export default function UserOnlineList() {
    const [ users, setUsers ] = useState([]);
    const [ readyState, setReadyState ] = useState(false);
    const [ auth, setAuth ] = useState<authUser>();

    useEffect(() => {
        setAuth(getAuth());
    }, []);

    useEffect(() => {
        if (readyState == true) {
            eventEmitter.on('useronline', (data) => {
                setUsers(data);
            });

            webSocket.send(JSON.stringify({ type: 'get_connections' }));
        } else {
            setReadyState(webSocket.readyState == 1);
            if (readyState == false) {
                setTimeout(() => {
                    setReadyState(webSocket.readyState == 1);
                }, 1000);
            }
        }
    }, [readyState]);
    
    return (
        <>
            <FormMessage />
            <div className="user-online-list">
                <h5>Total users: { Object.keys(users).length }</h5>
                <ul>
                    {Object.keys(users).map((key: any) => {
                        const user: any = users[key] ?? {};
                        if (user.id) {
                            return (
                                <li key={ user.id } data-key={user.id}>
                                    <a className={auth?.id == user.id ? 'me' : ''}>{ user.name }</a>
                                </li>
                            )
                        }
                    })}
                </ul>
            </div>
        </>
    )
}