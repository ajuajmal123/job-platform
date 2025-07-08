import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import AppErrorCode from "../constants/appErrorCode";
import { verifyToken } from "../utils/jwt";
import { AccessTokenPayload } from "../utils/jwt";
import { Types } from "mongoose"; 
const authenticate:RequestHandler=(req,res,next)=>{
    const accessToken=req.cookies.accessToken as string|undefined;
    appAssert(accessToken,UNAUTHORIZED,'Not Autherized',AppErrorCode.InvalidAccesToken);

    const {error,payload}=verifyToken<AccessTokenPayload>(accessToken);
    appAssert(
        payload && payload.userId && payload.sessionId,
        UNAUTHORIZED,
        error==='jwt expired'?'token expired':'Invalid Access token',
        AppErrorCode.InvalidAccesToken
    );
   req.userId=payload.userId;
   req.sessionId=payload.sessionId;
   next()

}

export default authenticate;