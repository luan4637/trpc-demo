import z from "zod";
import { 
    TicketRequestCreate,
    TicketRequestPagination,
    TicketRequestUpdate
} from "./TicketRequest";
import { prisma } from "../../prisma";
import { Prisma } from "@prisma/client";
import { TicketModelType } from "./TicketModel";
import { TRPCError } from "@trpc/server";
import { fileRepository } from "../File/FileRepository";

class TicketRepository
{
    async pagination(input: z.infer<typeof TicketRequestPagination>)
    {
        let assigneeClause = {};

        if (input.assigneeId) {
            assigneeClause = { contains: input.assigneeId };
        }

        const query: Prisma.TicketFindManyArgs = {
            skip: (input.page - 1) * input.limit,
            take: input.limit,
            where: {
                title: { contains: input.title },
                assigneeId: assigneeClause,
            },
            include: {
                assignee: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        };

        const [ tickets, count ] = await prisma.$transaction([
            prisma.ticket.findMany(query),
            prisma.ticket.count({
                where: {
                    title: { contains: input.title },
                    assigneeId: assigneeClause
                }
            })
        ]);

        return { tickets: <TicketModelType[]>tickets, count };
    }

    async getById(id: string)
    {
        const ticket: TicketModelType | null = await prisma.ticket.findUnique({
            where: { id },
            include: {
                files: true
            },
        });

        if (ticket === null) {
            throw new TRPCError({ code: 'NOT_FOUND' });
        }

        return ticket;
    }

    async create(input: z.infer<typeof TicketRequestCreate> & { id: string })
    {
        if (input.assigneeId == '') {
            input.assigneeId = null;
        }
        
        const ticket: TicketModelType = await prisma.ticket.create({
            data: input
        })

        return ticket;
    }

    async update(id: string, input: z.infer<typeof TicketRequestUpdate>)
    {
        if (input.assigneeId == '') {
            input.assigneeId = null;
        }
        
        const ticket: TicketModelType = await prisma.ticket.update({
            where: { id },
            data: input
        });

        return ticket;
    }
}

export const ticketRepository = new TicketRepository(); 