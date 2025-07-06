import { z } from "zod";
import { UserModel } from "../User/UserModel";

export const TicketModel = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    assignee: UserModel.optional(),
    assigneeId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    files: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            url: z.string(),
            type: z.string(),
            ticketId: z.string(),
            createdBy: z.string(),
            createdDate: z.date().optional(),
            updatedDate: z.date().optional()
        })
    ).optional()
});

export type TicketModelType = z.infer<typeof TicketModel>;
