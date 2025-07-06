import { CreateNextContextOptions, NextApiRequest } from "@trpc/server/adapters/next";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import * as jwt from "jsonwebtoken";
import { authUser } from "../utils/getAuth";
import { headers } from "next/headers";
import { IncomingMessage } from "http";


const getUserFromHeader = (req: any, res: any) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization ?? '';
        const jwtSecretKey = process.env.JWT_SECRET_KEY ?? '';
        const tokenString = token.split(' ')[1];

        try {
            if (tokenString && jwt.verify(tokenString, jwtSecretKey)) {
                return <authUser>jwt.decode(tokenString);
            }
        } catch(e) {
            return null;
        }
    }

    return null;
};

export const createContext = async (opts: CreateNextContextOptions) => {
    const { req, res } = opts;
    const user = getUserFromHeader(req, res);
    
    return {
        req,
        res,
        user
    };
}

export const createContextStandalone = (opts: CreateHTTPContextOptions) => {
    const { req, res } = opts;
    const user = getUserFromHeader(req, res);

    return {
        req,
        res,
        user
    };
};

export const createContextLambda = ({ event, context }: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
    const user = { id: '' };
    const req = { headers: event.headers };
    const res = {};
    
    return {
        req,
        res,
        user
    }
}

export type Context = Awaited<ReturnType<typeof createContext>>;
export type ContextStandalone = ReturnType<typeof createContextStandalone>;
export type ContextLambda = ReturnType<typeof createContextLambda>;
