import { api } from "../../utils/api";
import Form from "next/form";
import Link from "next/link";
import Pagination from "../../components/Pagination";
import { useSearchParams } from "next/navigation";
import { eventEmitter } from "../../utils/api"
import { useEffect } from "react";
import TicketItem from "./item";

export default function TicketPage()
{
    const searchParams = useSearchParams();
    let params = new URLSearchParams(searchParams);
    const curPage = Number(searchParams.get('page') ?? 1);
    const { data: result, isLoading, isError, refetch } = api.tickets.pagination.useQuery({
        title: searchParams.get('title') ?? '', 
        assigneeId: searchParams.get('assigneeId') ?? '',
        page: curPage,
    });
    const { data: users } = api.users.pagination.useQuery({ limit: 9999999 });

    useEffect(() => {
        eventEmitter.on('new_ticket', (data) => {
            refetch();
        });
    }, []);

    return (
        <div>
            <div className="page-heading">
                <h4>Tickets management</h4>
                <div className="btn-group">
                    <Link href={'/ticket/add'}>Add new</Link>
                </div>
            </div>
            <div className="form-filter">
                <Form action={'/ticket'} formMethod="GET" autoComplete="off">
                    <table>
                        <tbody>
                            <tr>
                                <th>Title</th>
                                <td><input type="text" name="title" /></td>
                                <th>Assignee</th>
                                <td>
                                    <select name="assigneeId">
                                        <option value={''}>--ALL--</option>
                                        {users?.users.map((item) => {
                                            return <option key={ item.id } value={ item.id }>{ item.name }</option>
                                        })}
                                    </select>
                                </td>
                                <td>
                                    <button type="submit">Filter</button>
                                    <Link href={'/ticket'}>Clear</Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Form>
            </div>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Assignee</th>
                        <th>Created Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {result?.tickets.map((item) => {
                        return (
                            <TicketItem key={item.id} {...item} />
                        )
                    })}
                </tbody>
            </table>
            <Pagination
                link="/ticket"
                params={params}
                totalPage={Math.ceil((result?.count ?? 0) / 10)}
            />
        </div>
    );
}