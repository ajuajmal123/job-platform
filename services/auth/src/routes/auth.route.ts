import { Router } from "express";
import { registerHandler,loginHandler,logoutHandler, refreshHandler, verifyEmailHandler, sendResetPasswordHandler, resetPasswordHandler } from "../controllers/auth.controller";

const authRoutes= Router();

authRoutes.post('/register',registerHandler);
authRoutes.post('/login',loginHandler)
authRoutes.get('/refresh',refreshHandler)
authRoutes.get('/email/verify/:code',verifyEmailHandler)
authRoutes.post('/password/forgot',sendResetPasswordHandler)
authRoutes.post('/password/reset',resetPasswordHandler)
authRoutes.get('/logout',logoutHandler)
export default authRoutes