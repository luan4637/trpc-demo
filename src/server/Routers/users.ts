import { publicProcedure, protectedProcedure, router } from '../trpc'
import { v4 as uuidv4 } from 'uuid'
import { 
    UserRequestPagination,
    UserRequestCreate,
    UserRequestGet,
    UserRequestDelete,
    UserRequestUpdate
}
from '../Core/User/UserRequest'
import { userRepository } from '../Core/User/UserRepository';
import { UserModelType } from '../Core/User/UserModel';

// const userProcedure = publicProcedure.input(z.object({ id: z.string() }))

export const userRouter = router({
    pagination: protectedProcedure
        .input(UserRequestPagination)
        .query(async (req) => {
            const { input } = req;
            const results = userRepository.pagination(input);

            return results;
        }
    ),
    get: protectedProcedure
        .input(UserRequestGet)
        .query(req => {
            const { input } = req;

            if (!input.id) {
                return <UserModelType>{};
            }

            const user = userRepository.getById(input.id);

            return user;
        }
    ),
    create: protectedProcedure
        .input(UserRequestCreate)
        .mutation(async (req) => {
            const { input } = req;
            const { ...dataSave } = input;
            const userData = Object.assign({ id: uuidv4() }, dataSave);

            const user = userRepository.create(userData);

            return user;
        }
    ),
    update: protectedProcedure
        .input(UserRequestUpdate)
        .mutation(req => {
            const { input } = req;
            const user = userRepository.update(input.id, input);

            return user;
        }
    ),
    delete: protectedProcedure
        .input(UserRequestDelete)
        .mutation(async (req) => {
            const { input } = req;
            const user = userRepository.delete(input.id);

            return user;
        }
    ),
});