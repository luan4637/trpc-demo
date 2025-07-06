import z from "zod";
import { TicketModel } from "../Ticket/TicketModel";
import { UserModel } from "../User/UserModel";

export const FileModel = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    url: z.string(),
    ticketId: z.string(),
    ticket: TicketModel.optional(),
    createdBy: z.string(),
    user: UserModel.optional(),
    createdDate: z.date().optional(),
    updatedDate: z.date().optional()
});

export type FileModelType = z.infer<typeof FileModel>;
