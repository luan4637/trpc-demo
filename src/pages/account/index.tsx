import Form from "next/form";
import { api } from "../../utils/api";
import { FormEvent } from "react";
import { toast } from "react-toastify";
import { UserRequestUpdateAccount } from "../../server/Core/User/UserRequest";
import Link from "next/link";

export default function AccountPage() {
    const generatePresignedUrl = api.generatePresignedUrl.useMutation();
    const { data: user } = api.account.get.useQuery();
    const { mutate } = api.account.update.useMutation({
        onSuccess: () => {
            toast('Update successfully!');
        },
        onError: (error) => {
            toast(error.message);
        }
    });

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const fileAvatar = formData.get('avatar');
        const formValues = Object.fromEntries(formData);
        const result = UserRequestUpdateAccount.safeParse(formValues)
        
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
                    } else {
                        result.data.avatar = user?.avatar;
                    }
                }
            } else {
                result.data.avatar = user?.avatar;
            }
            
            await mutate(result.data);
        }
    };

    return (
        <div className="account-page">
            <Form action={''} onSubmit={onSubmit}>
                <p>
                    <label>Avatar</label>
                    <input name="avatar" type="file" />
                    {user?.avatar ? 
                        <img src={user?.avatar} alt="Avatar" height={100} /> : ''}
                </p>
                <p>
                    <label>Name</label>
                    <input name="name" defaultValue={user?.name} />
                </p>
                <p>
                    <label>Email</label>
                    <input name="email" defaultValue={user?.email} />
                </p>
                <p>
                    <label>Password</label>
                    <input name="password" type="password" />
                    <span>Leave bank if you don't want to change</span>
                </p>
                <p>
                    <label>Confirm Pasword</label>
                    <input name="confirmPassword" type="password" />
                </p>
                <p>
                    <button type="submit">Save</button>
                    <Link href={'/'}>Back to users list</Link>
                </p>
            </Form>
        </div>
    )
}