import { router } from "../trpc";
import { accountRouter } from "./acount";
import { userRouter } from "./users";
import { commonRouter } from "./common";
import { ticketRouter } from "./tickets";
import { fileRouter } from "./files";


export const appRouter = router({
    ...commonRouter,
    // logs: publicProcedure
    //     .input(v => {
    //         if (typeof v == 'string') {
    //             return v;
    //         }

    //         throw new Error('invalid input: expected string');
    //     })
    //     .mutation(req => {
    //         console.log(`Client says: ${req.input}`);
    //         return true;
    //     }
    // ),
    // secretData: protectedProcedure.query(({ ctx }) => {
    //     return 'secret function';
    // }),
    tickets: ticketRouter,
    users: userRouter,
    account: accountRouter,
    files: fileRouter
});

export type AppRouter = typeof appRouter;