import { FormEvent, useEffect, useState } from "react"
import { eventEmitter, webSocket } from "../utils/api";

export default function FormMessage() {
    const [ message, setMessage ] = useState('');
    const [ listMessage, setListMessage ] = useState<string[]>([]);

    const messageChange = (event: FormEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setMessage(value);
    }

    const handleSend = (event: FormEvent<HTMLButtonElement>) => {
        const msg = message;
        webSocket.send(JSON.stringify({ 
            type: 'public_message',
            message: msg
        }));

        setMessage('');
    };

    useEffect(() => {
        eventEmitter.on('public_message', (data) => {
            listMessage.push(data);
            setListMessage([...listMessage]);
        });
    }, []);

    return (
        <div className="form-msg">
            <h4>Boardcast</h4>
            <ul>
                {listMessage.map((value, index) => {
                    return <li key={index}>{ value }</li>
                })}
            </ul>
            <p>
                <input type="text" onChange={messageChange} value={message} />
                <button type="button" onClick={handleSend}>Send</button>
            </p>
        </div>
    )
}
