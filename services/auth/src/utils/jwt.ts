import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { SessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

export type RefreshTokenPayload = {
    sessionId: SessionDocument['_id'];
};

export type AccessTokenPayload = {
    userId: UserDocument['_id'];
    sessionId: SessionDocument['_id'];
};

export type SignOptionsAndSecret = SignOptions & {
    secret: string;
};


const defaults: SignOptions & VerifyOptions = {
    audience: ['user'] 
};

const accessTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: '15m',
    secret: JWT_SECRET
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: '30d',
    secret: JWT_REFRESH_SECRET
};

export const signToken = (
    payload: AccessTokenPayload | RefreshTokenPayload,
    options?: SignOptionsAndSecret,
) => {
    const { secret, ...SignOpts } = options || accessTokenSignOptions;
    return jwt.sign(payload, secret, {
        ...defaults,
        ...SignOpts,
    });
};

interface VerifyTokenOptions extends VerifyOptions {
    secret: string;
}

 export const verifyToken = <TPayload extends object = AccessTokenPayload>(
    token: string,
    options?: VerifyTokenOptions
) => {
    const { secret = JWT_SECRET, ...VerifyOpts } = options || {};
    try {
        const payload = jwt.verify(
            token, 
            secret, 
            { ...defaults, ...VerifyOpts }
        )  as TPayload;
        return {
            payload
        };
    } catch (error: any) {
        return {
            error: error.message
        };
    }
}; 