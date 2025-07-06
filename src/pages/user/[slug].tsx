'use client'
import { api } from "../../utils/api"
import Link from "next/link"
import Form from "next/form"
import { useRouter } from "next/navigation"
import { useRouter as useNextRouter } from "next/router"
import { FormEvent } from "react"
import { UserRequestUpdate } from "../../server/Core/User/UserRequest"
import { toast } from "react-toastify";

export default function UserSlugPage() {
    const router = useRouter();
    const nextRouter = useNextRouter();
    const generatePresignedUrl = api.generatePresignedUrl.useMutation();
    const { mutate } = api.users.update.useMutation({
        onSuccess: () => {
            router.push('/user');
        },
        onError: (error) => {
            toast(error.message);
        }
    });
    const slug = nextRouter.query.slug?.toString() ?? '';
    const { data: user } = api.users.get.useQuery({ id: slug });

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const fileAvatar = formData.get('avatar');
        const formValues = Object.fromEntries(formData);
        const result = UserRequestUpdate.safeParse(formValues);
        
        if (!result.success) {
            toast(JSON.stringify(result.error.issues));
        } else {
            if (fileAvatar instanceof File && fileAvatar.name != '') {
                const file = result.data.avatar;
                const { url } = await generatePresignedUrl.mutateAsync({
                    fileName: (new Date().getTime()) + file.name,
                    fileType: file.type,
                });
                if (url) {
                    const urlResponse = await fetch(url, {
                        method: 'PUT',
                        body: file,
                    });
                    if (urlResponse.status === 200) {
                        result.data.avatar = urlResponse.url.split('?')[0] ?? '';
                    }
                }
            } else {
                result.data.avatar = user?.avatar;
            }

            

            await mutate(result.data);
        }
    }

    return (
        <div>
            <h1>Edit User ID: { user?.id }</h1>
            <div className="form">
                <Form action={''} onSubmit={onSubmit}>
                    <input type="hidden" name="id" defaultValue={ user?.id } />
                    <table border={1}>
                        <tbody>
                            <tr>
                                <th>Avatar</th>
                                <td>
                                    <input name="avatar" type="file" />
                                    <img src={ user?.avatar ?? '' } height={100} alt="Avatar" />
                                    {/* <input type="hidden" name="avatar" defaultValue={ user?.avatar ?? '' } /> */}
                                </td>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <td>
                                    <input name="name" defaultValue={ user?.name } />
                                </td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>
                                    <input name="email" defaultValue={ user?.email } />
                                </td>
                            </tr>
                            <tr>
                                <th>Password</th>
                                <td>
                                    <input name="password" type="password" />
                                    <br />
                                    Leave bank if you don't want to change
                                </td>
                            </tr>
                            <tr>
                                <th>Confirm Password</th>
                                <td>
                                    <input name="confirmPassword" type="password" />
                                </td>
                            </tr>
                            <tr>
                                <th></th>
                                <td>
                                    <button type="submit">Submit</button>
                                    <Link href={'/user'}>Back</Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Form>
            </div>
        </div>
    )
}