import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { UNAUTHORIZED } from "../constants/http";
import { AccessTokenPayload, verifyToken } from "../utils/jwt";
import mongoose from "mongoose";



const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccesToken
  );

  const { error, payload } = verifyToken<AccessTokenPayload>(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccesToken
  );

  req.userId = payload.userId  as unknown as mongoose.Types.ObjectId
  req.sessionId = payload.sessionId as unknown as mongoose.Types.ObjectId
  next();
};

export default authenticate;