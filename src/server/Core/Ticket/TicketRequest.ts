import z from "zod";

enum ORDER {
    ASC = "asc",
    DESC = "desc"
};

export const TicketRequestPagination = z.object({
    page: z.number().default(1),
    limit: z.number().default(10),
    title: z.string().optional(),
    assigneeId: z.string().optional(),
    sort: z.string().optional(),
    order: z.enum([ORDER.ASC, ORDER.DESC]).default(ORDER.DESC)
});

export const TicketRequestCreate = z.object({
    title: z.string(),
    description: z.string(),
    assigneeId: z.string().nullable()
});

export const TicketRequestUpdate = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    assigneeId: z.string().nullable()
});

export const TicketRequestGet = z.object({
    id: z.string()
});
