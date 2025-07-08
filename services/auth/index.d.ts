import mongoose from "mongoose";
import { AccessTokenPayload } from "./src/utils/jwt";

declare global {
    namespace Express{
        interface Request{
            userId?:mongoose.Types.ObjectId;
            sessionId?:mongoose.Types.ObjectId;
            user?:AccessTokenPayload;
        }
    }
}

export {}