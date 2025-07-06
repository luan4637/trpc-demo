import z from "zod";

export const FileRequestCreate = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    url: z.string(),
    ticketId: z.string(),
    createdBy: z.string()
});

export const FileRequestDelete = z.object({
    id: z.string()
})