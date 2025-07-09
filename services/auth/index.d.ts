import mongoose from "mongoose";
import { AccessTokenPayload } from "./src/utils/jwt";

declare global {
    namespace Express{
        interface Request{
            userId:Types.ObjectId;
            sessionId:Types.ObjectId;
            
        }
    }
}

export {}