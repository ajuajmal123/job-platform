import { CookieOptions, Response } from "express"
import { thirtyDaysFromNow,fifteenMinutesFromNow } from "./date";

const secure=process.env. NODE_ENV !="development";
const defaults:CookieOptions={
    sameSite:"strict",
    httpOnly:true,
    secure
}

const getAccesTokenCookieOptions=():CookieOptions=>({

    ...defaults,
    expires:fifteenMinutesFromNow()
})

const getRefreshTokenCookieOptions=():CookieOptions=>({
    ...defaults,
    expires:thirtyDaysFromNow(),
    path:'/auth/refresh'
})
type Params={
    res:Response;
    accessToken:string;
    refreshToken:string;
}

export const setAuthCookies=({res,accessToken,refreshToken}:Params)=>

    res
    .cookie('accessToken',accessToken,getAccesTokenCookieOptions())
    .cookie('refreshToken',refreshToken,getRefreshTokenCookieOptions());