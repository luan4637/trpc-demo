import { FormEvent, ReactElement } from "react"
import LoginLayout from "../../components/LoginLayout"
import Form from "next/form"
import { toast } from "react-toastify";
import { UserRequestLogin } from "../../server/Core/User/UserRequest";
import { api } from "../../utils/api";
import { useRouter } from "next/navigation";
import { setToken } from "../../utils/api";

export default function LoginPage() {
    const router = useRouter();
    const { mutate } = api.auth.useMutation({
        onSuccess: (data) => {
            setToken(data.token, data.refreshToken);
            router.push('/user');
        },
        onError: (error) => {
            toast(error.message);
        }
    });
    
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formValues = Object.fromEntries(formData);
        const result = UserRequestLogin.safeParse(formValues)
        
        if (!result.success) {
            toast(JSON.stringify(result.error.issues));
        } else {
            mutate(result.data);
        }
    }

    return (
        <div className="login-page">
            <h2>login page</h2>
            <Form action={'/login'} onSubmit={onSubmit}>
                <table border={1}>
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <td><input name="email" /></td>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <td><input type="password" name="password" /></td>
                        </tr>
                        <tr>
                            <th></th>
                            <td><button type="submit">Login</button></td>
                        </tr>
                    </tbody>
                </table>
            </Form>
        </div>
    )
}

LoginPage.getLayout = (page: ReactElement) => {
    return (
        <LoginLayout>{page}</LoginLayout>
    )
}