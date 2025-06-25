import mongoose from "mongoose";
import { date } from "zod";
import { thirtyDaysFromNow } from "../utils/date";

export interface SessionDocument extends mongoose.Document{
    userId:mongoose.Types.ObjectId;
    userAgent?:string;
    createdAt:Date;
    expairesAt:Date;
};

const sessionSchema=new mongoose.Schema<SessionDocument>({
    userId:{
         ref:'User',
        type:mongoose.Schema.Types.ObjectId,
        index:true,
       
    },
    userAgent:{
        type:String
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    expairesAt:{
        type:Date,
        default:thirtyDaysFromNow,
    },

});

const SessionModel= mongoose.model<SessionDocument>('Session',sessionSchema);

export default SessionModel;