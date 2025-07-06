import { fileRepository } from "../Core/File/FileRepository";
import { FileRequestCreate, FileRequestDelete } from "../Core/File/FileRequest";
import { protectedProcedure, router } from "../trpc";

export const fileRouter = router({
    create: protectedProcedure
        .input(FileRequestCreate)
        .mutation((req) => {
            const { input } = req;

            return fileRepository.create(input);
        }
    ),
    delete: protectedProcedure
        .input(FileRequestDelete)
        .mutation((req) => {
            const { input } = req;

            return fileRepository.delete(input.id);
        })
})