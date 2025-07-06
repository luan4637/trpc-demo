import { protectedProcedure, router } from "../trpc";
import { v4 as uuidv4 } from "uuid";
import {
    TicketRequestCreate,
    TicketRequestGet,
    TicketRequestPagination,
    TicketRequestUpdate
} from "../Core/Ticket/TicketRequest";
import { ticketRepository } from "../Core/Ticket/TicketRepository";
import { TicketModelType } from "../Core/Ticket/TicketModel";

export const ticketRouter = router({
    pagination: protectedProcedure
        .input(TicketRequestPagination)
        .query((req) => {
            const { input } = req;
            
            return ticketRepository.pagination(input);
        }
    ),
    get: protectedProcedure
        .input(TicketRequestGet)
        .query(async (req) => {
            const { input } = req;

            if (!input.id) {
                return <TicketModelType>{};
            }

            const result = await ticketRepository.getById(input.id);

            return result;
        }
    ),
    create: protectedProcedure
        .input(TicketRequestCreate)
        .mutation((req) => {
            const { input } = req;
            const { ...dataSave } = input;

            const data = Object.assign({ id: uuidv4() }, dataSave);

            return ticketRepository.create(data);
        }
    ),
    update: protectedProcedure
        .input(TicketRequestUpdate)
        .mutation((req) => {
            const { input } = req;

            return ticketRepository.update(input.id, input);
        }
    ),
})