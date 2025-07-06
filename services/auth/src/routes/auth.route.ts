import { Router } from "express";
import { registerHandler,loginHandler,logoutHandler, refreshHandler, verifyEmailHandler, resetPasswordHandler } from "../controllers/auth.controller";

const authRoutes= Router();

authRoutes.post('/register',registerHandler);
authRoutes.post('/login',loginHandler)
authRoutes.get('/refresh',refreshHandler)
authRoutes.get('/email/verify/:code',verifyEmailHandler)
authRoutes.get('/password/reset',resetPasswordHandler)
authRoutes.get('/logout',logoutHandler)
export default authRoutes