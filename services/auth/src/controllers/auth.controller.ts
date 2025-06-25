import catchError from "../utils/catchError";
import z from 'zod'

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
    async (req,res)=>{
     const request=registerSchema.parse({
        ...req.body,
        userAgent:req.headers['user-agent']
     })     
    }
)
