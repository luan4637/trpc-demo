import { api } from "../../utils/api"
import Link from "next/link"
import UserItem from "./item"
import From from "next/form"
import { useSearchParams } from "next/navigation"
import Pagination from "../../components/Pagination"

export default function UserPage() {
    const searchParams = useSearchParams();
    let params = new URLSearchParams(searchParams);
    const curPage = Number(searchParams.get('page') ?? 1);
    const { data: result, isLoading, isError } = api.users.pagination.useQuery({
        name: searchParams.get('name') ?? '', 
        email: searchParams.get('email') ?? '',
        page: curPage,
    });

    return (
        <div>
            <div className="page-heading">
                <h4>Users management</h4>
                <div className="btn-group">
                    <Link href={'/user/add'}>Add new</Link>
                </div>
            </div>
            <div className="form-filter">
                <From action={'/user'} formMethod="GET" autoComplete="off">
                    <table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td><input name="name" defaultValue={searchParams.get('name') ?? ''} /></td>
                                <th>Email</th>
                                <td><input name="email" defaultValue={searchParams.get('email') ?? ''} /></td>
                                <td>
                                    <button type="submit">Filter</button>
                                    <Link href={'/user'}>Clear</Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </From>
            </div>
            
            <table border={1}>
                <thead>
                    <tr>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created Date</th>
                        <th>Updated Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {result?.users.map((user) => {
                        return (
                            <UserItem key={user.id} {...user} />
                        )
                    })}
                </tbody>
            </table>
            <Pagination
                link="/user"
                params={params}
                totalPage={Math.ceil((result?.count ?? 0) / 10)}
            />
        </div>
    )
}