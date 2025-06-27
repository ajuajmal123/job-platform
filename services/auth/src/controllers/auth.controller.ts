import { CREATED } from "../constants/http";
import { createAccount } from "../services/auth.service";
import catchError from "../utils/catchError";
import z from 'zod'
import { setAuthCookies } from "../utils/cookie";

const registerSchema=z.object({
    name: z.string().min(1).max(255),
    email: z.string().email().min(1).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional()
}).refine((data)=>data.password===data.confirmPassword,
{
    message:'password do not matching',
    path:['confirmPassword']
});

export const registerHandler=catchError(
   //validate request
    async (req,res)=>{
     const request=registerSchema.parse({
        ...req.body,
        userAgent:req.headers['user-agent']
     }) ;

    //call service
    const { user,accessToken,refreshToken}=await createAccount(request);

    //return response
    return setAuthCookies({res,accessToken,refreshToken})  //pass tokens to cookies
     .status(CREATED)
     .json(user);

    });

