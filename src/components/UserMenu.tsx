import Link from "next/link";
import Image from "next/image";
import getAuth, { authUser } from "../utils/getAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
    const [ user, setUser ] = useState<authUser>();
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        setUser(auth);
        if (!auth.id) {
            router.push('/login');
        }
    }, [])

    return (
        <div className="header-user">
            <ul>
                <li className="account"><Link href={'/account'}>
                {user?.avatar && <img 
                        src={ user?.avatar }
                        alt={ user?.name }
                />}
                { user?.email }</Link></li>
                <li><Link href={'/logout'}>Logout</Link></li>
            </ul>
        </div>
    )
}