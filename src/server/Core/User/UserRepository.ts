import { TRPCError } from "@trpc/server";
import { prisma } from "../../prisma";
import { UserModelType } from "./UserModel";
import { hashPassword } from "../../../utils/getAuth";
import { 
    UserRequestCreate, 
    UserRequestPagination, 
    UserRequestUpdateAccount
} from "./UserRequest";
import z from "zod";
import { Prisma } from "@prisma/client";

class UserRepository
{
    async pagination(input: z.infer<typeof UserRequestPagination>)
    {
        const query: Prisma.UserFindManyArgs = {
            skip: (input.page - 1) * input.limit,
            take: input.limit,
            where: {
                name: { contains: input.name },
                email: { contains: input.email }
            },
            orderBy: {
                createdAt: 'desc'
            }
        };

        const [ users, count ] = await prisma.$transaction([
            prisma.user.findMany(query),
            prisma.user.count({
                where: {
                    name: { contains: input.name },
                    email: { contains: input.email }
                }
            })
        ]);

        return { users, count };
    }

    async getById(id: string)
    {
        const user: UserModelType | null = await prisma.user.findUnique({
            where: { id: id }
        })

        if (user === null) {
            throw new TRPCError({ code: 'NOT_FOUND' });
        }

        return user;
    }

    async create(input: z.infer<typeof UserRequestCreate> & { id: string })
    {
        const { confirmPassword, ...dataSave } = input;
        let data = dataSave;
        data.password = hashPassword(data.password);
        
        const user = await prisma.user.create({ data });

        return user;
    }

    async update(id: string, input: z.infer<typeof UserRequestUpdateAccount>)
    {
        const { password, confirmPassword, ...dataSave } = input;
        let data = dataSave;

        if (password) {
            data = Object.assign({ password: hashPassword(password) }, data);
        }
        
        const user = await prisma.user.update({
            where: { id },
            data: data,
        });

        return user;
    }

    async delete(id: string)
    {
        const user = await prisma.user.delete({
            where: { id }
        });

        return user;
    }
}

export const userRepository: UserRepository = new UserRepository();
