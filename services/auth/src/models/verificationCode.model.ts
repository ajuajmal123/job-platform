import mongoose from "mongoose";
import verificationCodeType from "../constants/verificationCodeType";

export interface verificationCodeDocument extends mongoose.Document{

    userId:mongoose.Types.ObjectId;
    type:verificationCodeType;
    expairesAt:Date;
    createdAt:Date;
};

const verificationCodeSchema= new mongoose.Schema<verificationCodeDocument>({

userId:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true,
    index:true
},
type:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    required:true,
    default:Date.now
},
expairesAt:{
    type:Date,
    required:true
}
});

const VerificationCodeModel=mongoose.model<verificationCodeDocument>('VerificationCode',verificationCodeSchema,'verification_codes');

export default VerificationCodeModel;