import { protectedProcedure, router } from '../trpc'
import {  UserRequestUpdateAccount } from '../Core/User/UserRequest'
import { userRepository } from '../Core/User/UserRepository';

export const accountRouter = router({
    get: protectedProcedure
        .query(async(req) => {
            const { ctx } = req;

            const user = userRepository.getById(ctx.user?.id ?? '');

            return user;
        }
    ),
    update: protectedProcedure
        .input(UserRequestUpdateAccount)
        .mutation(async (req) => {
            const { input, ctx } = req;

            const id = ctx.user?.id ?? '';
            const user = userRepository.update(id, input);

            return user;
        }
    ),
});