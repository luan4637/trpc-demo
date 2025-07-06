import Link from "next/link";
import { fnFormatDateTime } from "../../utils/formats";
import { TicketModelType } from "../../server/Core/Ticket/TicketModel";

type Ticket = {
    id: string,
    title: string,
    assignee?: { name: string },
    createdAt: string,
    updatedAt: string
};

export default function TicketItem(props: Ticket)
{
    return (
        <tr>
            <td>{props.title}</td>
            <td>{props.assignee?.name}</td>
            <td>{props.createdAt}</td>
            <td>
                <Link href={`/ticket/${props.id}`}>Edit</Link>
            </td>
        </tr>
    )
}