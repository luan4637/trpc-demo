import Form from "next/form"
import Link from "next/link"
import { api, webSocket } from "../../../utils/api";
import { FormEvent, useEffect, useState } from "react";
import { TicketRequestCreate } from "../../../server/Core/Ticket/TicketRequest";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import FilesPartial from "./files";

export default function FormPartial(props: { ticket?: any })
{
    const router = useRouter();
    const { data: users } = api.users.pagination.useQuery({ limit: 9999999 });
    const [ state, setState ] = useState<any>();
    const { mutate } = api.tickets.create.useMutation({
        onSuccess: (ticket) => {
            webSocket.send(JSON.stringify({ 
                type: 'new_ticket',
                message: ticket
            }));
            router.push('/ticket/' + ticket.id);
            toast('Ticket has created successfully');
        },
        onError: (error) => {
            toast(error.message);
        }
    });
    const { mutate: mutateUpdate } = api.tickets.update.useMutation({
        onSuccess: (ticket) => {
            toast('Ticket has updated successfully');
        },
        onError: (error) => {
            toast(error.message);
        }
    });

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formValues = Object.fromEntries(formData);
        const result = TicketRequestCreate.safeParse(formValues);

        if (!result.success) {
            toast(JSON.stringify(result.error.issues));
        } else {
            if (state?.id) {
                const data = Object.assign({ id: state.id }, result.data);
                await mutateUpdate(data);
            } else {
                await mutate(result.data);
            }
        }
    };

    const assigneeChange = (event: FormEvent<HTMLSelectElement>) => {
        const value = event.currentTarget.value;
        const stateChange = { ...state };
        stateChange.assigneeId = value;
        setState(stateChange);
    };

    useEffect(() => {
        setState(props.ticket);
    }, [props.ticket]);

    return (
        <div className="form">
            <Form onSubmit={handleSubmit} action={'/ticket'} autoComplete="off" noValidate>
                <input type="hidden" name="id" defaultValue={state?.id} />
                <table border={1}>
                    <tbody>
                        <tr>
                            <th>Title</th>
                            <td><input 
                                name="title"
                                type="text"
                                placeholder="Title"
                                defaultValue={state?.title}
                            /></td>
                        </tr>
                        <tr>
                            <th>Description</th>
                            <td><textarea 
                                name="description"
                                placeholder="Description"
                                defaultValue={state?.description ?? ''}
                            ></textarea></td>
                        </tr>
                        <tr>
                            <th>Assignee:</th>
                            <td>
                                <select name="assigneeId" onChange={assigneeChange} value={state?.assigneeId ?? ''}>
                                    <option value="">--Choose one--</option>
                                    {users?.users.map((item) => {
                                        return <option key={ item.id } value={ item.id }>{ item.name }</option>
                                    })}
                                </select>
                            </td>
                        </tr>
                        {state?.id && <tr>
                            <th>Files:</th>
                            <td>
                                <FilesPartial ticketId={state?.id} files={state?.files} />
                            </td>
                        </tr>}
                        <tr>
                            <th></th>
                            <td>
                                <button type="submit">Submit</button>
                                <Link href={'/ticket'}>Back</Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Form>
        </div>
    )
}