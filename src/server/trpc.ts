import { initTRPC, TRPCError } from "@trpc/server";
import { Context, ContextStandalone, ContextLambda } from "./context";

const t = initTRPC
    .context<Context | ContextStandalone | ContextLambda>()
    .create();

const isProtectedMiddleware = t.middleware((opts) => {
    const { ctx, next } = opts;

    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next({ 
        ctx
    })
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isProtectedMiddleware);
