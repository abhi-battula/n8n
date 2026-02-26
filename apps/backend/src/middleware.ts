import { NextFunction,Request,Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "node:process";

export function authMiddleware(req:Request,res:Response,next:NextFunction){
    const token = req.headers["authorization"] as string;
    if (!token){
        return res.status(411).json("authorization token missing");
    }
    const secret = process.env.JWT_SECRET!;
    try{
        const data = jwt.verify(token,secret) as JwtPayload;
        req.userId = data.id;
        console.log("verify data----*******************",data);
        
        // console.log("req111",req);
        
        next();
    }catch(e){
        res.status(403).json("your token is incorrect")
    }
}