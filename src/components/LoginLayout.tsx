import { ToastContainer } from "react-toastify";

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="wrapper">
            {children}
            <ToastContainer />
        </div>
    )
}