import z from 'zod'

const emailSchema=z.string().email().min(1).max(255);
const  passwordSchema= z.string().min(6).max(255);
const nameSchema= z.string().min(1).max(255);
export const loginSchema=z.object({
  email:emailSchema,
  password:passwordSchema,
  userAgent: z.string().optional(),
});

export const registerSchema=loginSchema
.extend({
   name:nameSchema,
    confirmPassword: z.string().min(6).max(255),
   
})
.refine((data)=>data.password===data.confirmPassword,
{
    message:'password do not matching',
    path:['confirmPassword']
});