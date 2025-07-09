import { NOT_FOUND, OK } from "../constants/http";
import userModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchError from "../utils/catchError";

export const getUserHandler=catchError(
    async (req,res)=>{
    const user=await userModel.findById(req.userId);
    appAssert(user,NOT_FOUND,'User not found');
    return res.status(OK).json(user.omitPassword());
})