import * as jwt from "jsonwebtoken"

const crypto = require('crypto');

export interface authUser {
    id: string,
    name: string
    email: string,
    avatar?: string,
    iat?: number,
    exp?: number
}

export interface UserPayload {
    id: string,
    name: string,
    email: string,
    avatar?: string
}

export const hashPassword = (password: string) => {
    return crypto.createHash('sha256').update(password).digest('hex')
}

export default function getAuth() {
    const token = localStorage.getItem('token') ?? '';
    const payload: jwt.JwtPayload | null = jwt.decode(token, { json: true });

    const user: authUser = {
        id: payload?.id,
        name: payload?.name,
        email: payload?.email,
        avatar: payload?.avatar ?? '',
        iat: payload?.iat ?? 0,
        exp: payload?.exp ?? 0
    };
    
    return user;
}