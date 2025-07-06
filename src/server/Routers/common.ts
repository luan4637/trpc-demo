import { publicProcedure, protectedProcedure, router } from "../trpc";
import { UserRequestLogin, UserRequestToken } from "../Core/User/UserRequest";
import { prisma } from "../prisma";
import { UserModelType } from "../Core/User/UserModel";
import * as jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { UserPayload, hashPassword } from "../../utils/getAuth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import z from 'zod';
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

let expireTime: number = 15 * 60;

const s3 = new S3Client({ 
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'admin',
        secretAccessKey: 'admin',
    },
    endpoint: 'http://s3.localhost.localstack.cloud:4566'
});

const ee = new EventEmitter();

export const commonRouter = {
    '': publicProcedure.query(({ ctx }) => {
        return 'This is homepage';
    }),
    test: publicProcedure.query(({ ctx }) => {
        return 'This is test';
    }),
    public: publicProcedure.query(({ ctx }) => {
        return 'This is public router';
    }),
    auth: publicProcedure
        .input(UserRequestLogin)
        .mutation(async (req) => {
            const jwtSecretKey = process.env.JWT_SECRET_KEY ?? '';
            const jwtRefreshKey = process.env.JWT_REFRESH_KEY ?? '';
            const { input } = req;
            const user: UserModelType | null = await prisma.user.findUnique({
                where: {
                    email: input.email
                }
            });

            if (user && user.password === hashPassword(input.password)) {
                const userPayload: UserPayload = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar ?? ''
                };
                const token = jwt.sign(userPayload, jwtSecretKey, { expiresIn: expireTime });

                const refreshToken = jwt.sign(userPayload, jwtRefreshKey);
                
                return {
                    token,
                    refreshToken
                };
            } else {
                throw new Error('Cannot find the user');
            }
        }
    ),
    token: publicProcedure
        .mutation(req => {
            const { ctx } = req;
            const refreshToken = ctx.req.headers.authorization;
            const jwtSecretKey = process.env.JWT_SECRET_KEY ?? '';
            const jwtRefreshKey = process.env.JWT_REFRESH_KEY ?? '';
            const tokenString = refreshToken?.split(' ')[1];

            try {
                if(tokenString && jwt.verify(tokenString, jwtRefreshKey)) {
                    const user = jwt.decode(tokenString, { json: true });
                    const userPayload: UserPayload = {
                        id: user?.id,
                        name: user?.name,
                        email: user?.email
                    };
                    const token = jwt.sign(userPayload, jwtSecretKey, { expiresIn: expireTime });

                    return { token };
                }
            }
            catch (e) {
                throw new TRPCError({ message: 'Invalid refresh token', code: 'BAD_REQUEST' });
            }
        }
    ),
    generatePresignedUrl: publicProcedure
        .input(z.object({ fileName: z.string(), fileType: z.string() }))
        .mutation(async ({ input }) => {
            const command = new PutObjectCommand({
                Bucket: 'sample-bucket',
                Key: input.fileName,
                ContentType: input.fileType,
            });
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            
            return { url };
        }
    ),
    onSend: publicProcedure.mutation((opts) => {
        // process.nextTick(() => {
            
        // });
        
    }),
}