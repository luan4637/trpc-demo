import Link from "next/link";
import { fnFormatDateTime } from "../../utils/formats";

type User = {
    id: string,
    name: string,
    avatar: string | null,
    email: string,
    createdAt: string,
    updatedAt: string
}

export default function UserItem(props: User)
{
    return (
        <tr>
            <td>{props.avatar && <img src={props.avatar ?? ''} height={60} alt={props.name} />}</td>
            <td>{props.name}</td>
            <td>{props.email}</td>
            <td>{props.createdAt}</td>
            <td>{props.updatedAt}</td>
            <td><Link href={`/user/${props.id}`}>Edit</Link></td>
        </tr>
    )
}