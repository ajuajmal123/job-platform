import assert from "node:assert";
import { httpStatusCode } from "../constants/http";
import AppErrorCode from "../constants/appErrorCode";
import AppError from "./AppError";

//Asserts a condetion and throw an app error if the conditon is falsy
type AppAssert=(
 condition:any,
 httpStatusCode:httpStatusCode,
 message:string,
 appErrorCode?:AppErrorCode
)=>asserts condition

const appAssert:AppAssert=(
         condition,
         httpStatusCode,
         message,
         appErrorCode
)=> assert(condition,new AppError(httpStatusCode,message,appErrorCode));

export default appAssert