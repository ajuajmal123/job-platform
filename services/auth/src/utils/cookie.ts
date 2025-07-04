import { CookieOptions, Response } from "express"
import { thirtyDaysFromNow,fifteenMinutesFromNow } from "./date";
export const REFRESH_PATH='/'

const defaults:CookieOptions={
    sameSite:process.env.NODE_ENV !== "development"?'lax':'strict',
    httpOnly:true,
    secure:process.env.NODE_ENV !== "development"
}

export const getAccesTokenCookieOptions=():CookieOptions=>({

    ...defaults,
    expires:fifteenMinutesFromNow()
})

export const getRefreshTokenCookieOptions=():CookieOptions=>({
    ...defaults,
    expires:thirtyDaysFromNow(),
    path:REFRESH_PATH
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

export const clearAuthCookies=(res:Response)=>
     res.clearCookie('accessToken').clearCookie('refreshToken',{
        path:REFRESH_PATH
     });