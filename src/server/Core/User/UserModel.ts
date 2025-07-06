import { z } from 'zod'

export const UserModel = z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().nullable(),
    email: z.string(),
    password: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export type UserModelType = z.infer<typeof UserModel>;
