// to catch rejected promises from all async controllers

import { NextFunction, Request, Response } from "express";

type asyncController=(
    req:Request,
    res:Response,
    next:NextFunction
)=> Promise<any>

const catchError=(controller:asyncController):asyncController=>
    async (req,res,next)=>{
        try {
            await controller(req,res,next);
        } catch (error) {
            next(error);
        }
    };

    export default catchError


