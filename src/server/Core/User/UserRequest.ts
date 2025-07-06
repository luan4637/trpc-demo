import { z } from 'zod'

enum ORDER {
  ASC = "asc",
  DESC = "desc"
};

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const UserObjectUpdate = z.object({
    name: z.string().min(3).max(255),
    avatar: z.any()
        .refine((avatar) => {
            return avatar?.size <= MAX_FILE_SIZE, 'Max image size is 5MB.'
        })
        .refine((avatar) => {
            return ACCEPTED_IMAGE_TYPES.includes(avatar?.type), 'Only .jpg, .jpeg, .png and .webp formats are supported.'
        }
    ),
    email: z.string().min(3).max(255).email('The email is invalid'),
    password: z.string().min(6).max(511).or(z.literal('')),
    confirmPassword: z.string().min(6).or(z.literal(''))
});

const passwordMatch = (opts: { password: string, confirmPassword: string }) => {
    return opts.password === opts.confirmPassword; 
};
const passwordMatchMessage = { message: 'Confirm password do not match', path: ['confirmPassword'] };

export const UserRequestCreate = UserObjectUpdate.refine(passwordMatch, passwordMatchMessage);

export const UserRequestUpdate = UserObjectUpdate.extend({
    id: z.string(),
}).refine(passwordMatch, passwordMatchMessage);

export const UserRequestUpdateAccount = UserObjectUpdate.refine(passwordMatch, passwordMatchMessage);

export const UserRequestPagination = z.object({
    page: z.number().default(1),
    limit: z.number().default(10),
    name: z.string().optional(),
    email: z.string().optional(),
    sort: z.string().optional(),
    order: z.enum([ORDER.ASC, ORDER.DESC]).default(ORDER.DESC)
});

export const UserRequestGet = z.object({
    id: z.string()
});

export const UserRequestDelete = z.object({
    id: z.string()
});

export const UserRequestLogin = z.object({
    email: z.string().min(3).email('The email is invalid'),
    password: z.string().min(6)
});

export const UserRequestToken = z.object({
    refreshToken: z.string()
});
