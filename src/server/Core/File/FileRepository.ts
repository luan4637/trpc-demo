import z from "zod";
import { prisma } from "../../prisma";
import { FileRequestCreate, FileRequestDelete } from "./FileRequest";
import { FileModelType } from "./FileModel";

class FileRepository
{
    async createMany(input: z.infer<typeof FileRequestCreate>[])
    {
        let files: FileModelType[] = [];

        input.forEach(async (item) => {
            const fileExist = await prisma.file.findUnique({ where: { id: item.id } });
            if (!fileExist) {
                const file = await prisma.file.create({ data: item });
                files.push(file);
            }
        });

        return files;
    }

    async create(input: z.infer<typeof FileRequestCreate>)
    {
        const file = await prisma.file.create({ data: input });

        return file;
    }

    async delete(id: string)
    {
        const result = await prisma.file.delete({
            where: { id }
        });

        return result;
    }
}

export const fileRepository = new FileRepository();
