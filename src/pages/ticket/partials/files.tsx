import { FormEvent, useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import getAuth from "../../../utils/getAuth";
import z from "zod";
import { FileRequestCreate } from "../../../server/Core/File/FileRequest";
import ConfirmToast from "../../../components/ConfirmToast";

type UploadedFile = z.infer<typeof FileRequestCreate>;

type FilesPartialType = {
    ticketId: string,
    files: UploadedFile[]
};

export default function FilesPartial(props: FilesPartialType)
{
    const ticketId = props.ticketId;
    const [ files, setFiles ] = useState<UploadedFile[]>([]);
    const generatePresignedUrl = api.generatePresignedUrl.useMutation();
    const { mutate } = api.files.create.useMutation({
        onSuccess: () => {
            toast('File was uploaded successfully');
        },
        onError: (error) => {
            toast(error.message);
        }
    });
    const { mutate: mutateFile } = api.files.delete.useMutation({
        onSuccess: () => {
            toast('File was deleted successfully');
        }
    });

    useEffect(() => {
        setFiles(props.files)
    }, [props.files]);

    const handleUpload = async (event: FormEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        const { url } = await generatePresignedUrl.mutateAsync({
            fileName: (new Date().getTime()) + (file?.name ?? ''),
            fileType: (file?.type ?? ''),
        });
        if (url) {
            const urlResponse = await fetch(url, {
                method: 'PUT',
                body: file,
            });
            if (urlResponse.status === 200) {
                const newFile: UploadedFile = {
                    id: uuidv4(),
                    name: file?.name ?? '',
                    type: file?.type ?? '',
                    url: urlResponse.url.split('?')[0] ?? '',
                    ticketId: ticketId,
                    createdBy: getAuth().id
                };

                await mutate(newFile);

                const newFileList = [...files];
                newFileList.push(newFile);
                setFiles(newFileList);
            }
        }
    };

    const handleDelete = (id: string, name: string) => {
        toast(<ConfirmToast
            message={`Delete this file ${name}`}
            onConfirm={() => {
                const newFileList = [...files];
                for (let i = 0; i < newFileList.length; i++) {
                    if (newFileList[i].id == id) {
                        newFileList.splice(i, 1);
                    }
                }
                setFiles(newFileList);
                mutateFile({ id });
            }} 
        />, { autoClose: false, closeButton: false});
    }

    return (
        <div className="ticket-files">
            <div><input type="file" onChange={handleUpload} /></div>
            <ul>
                {files.map((item) => {
                    return <li key={item.id}><a target="_blank" href={item.url}>{item.name}</a> <a onClick={() => handleDelete(item.id, item.name)}>Remove</a></li>
                })}
            </ul>
        </div>
    )
}