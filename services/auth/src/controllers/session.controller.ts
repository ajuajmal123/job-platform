
import z from "zod";
import { NOT_FOUND, OK } from "../constants/http";
import SessionModel from "../models/session.model";
import catchError from "../utils/catchError";
import appAssert from "../utils/appAssert";


export const getSessionHandler=catchError(
    async (req,res)=>{
     const sessions=await SessionModel.find(
        {
        userId:req.userId,
        expairesAt:{$gt:new Date()},
     },
    {
        _id:1,
        userAgent:1,
        createdAt:1,

    },
    {
        sort:{createdAt:-1},
    }
    );

    return res.status(OK).json(
        ...sessions.map((session)=>({
            ...session.toObject(),
            ...(session.id===req.sessionId &&{
                isCurrent:true
            }),
        }))
    );
});


export const deleteSessionHandler=catchError(
    async (req,res)=>{
      const sessionId=z.string().parse(req.params.id);
      const deleted=await SessionModel.findOneAndDelete({
        _id:sessionId,
        userId:req.userId,
      })

      appAssert(deleted,NOT_FOUND,'session not found');

      res.status(OK).json({
        message:'Session Removed'
      })
})