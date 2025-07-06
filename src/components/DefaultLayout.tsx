import Link from "next/link"
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import UserMenu from "./UserMenu";
import UserOnlineList from "./UserOnlineList";
import Navigation from "./Navigation";

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="wrapper">
            <div className="header">
                <div className="container">
                    <div className="header-inner">
                        <div className="header-logo">
                            <Link href={'/'}><Image src="/logo.svg" height={70} width={70} alt="LOGO" priority={true} /></Link>
                        </div>
                        <Navigation />
                        <UserMenu />
                    </div>
                </div>
            </div>
            <div className="main-content">
                <div className="container">
                    {children}
                    <UserOnlineList />
                    <ToastContainer />
                </div>
            </div>
            <div className="footer">Footer</div>
        </div>
    )
}