import Link from "next/link";

export default function Navigation()
{
    return (
        <div className="header-nav">
            <ul>
                <li><Link href={'/'}>Tickets</Link></li>
                <li><Link href={'/user'}>Users</Link></li>
            </ul>
        </div>
    )
}