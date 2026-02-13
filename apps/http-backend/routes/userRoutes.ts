import { JWT_SECERET, SALT_ROUNDS } from "@repo/backend-common/secret";
import { CreateUserSchema, SignInSchema } from "@repo/common/types";
import { db } from "@repo/db/db";
import { user } from "@repo/db/schema";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function getAllUsersRoute(req: Request, res: Response) {
    try {
        const users = await db.select().from(user);
    
        return res.json({
            users,
            message: "Data"
        })
       } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
       }
}

export async function userSignInRoute(req: Request, res: Response){
    try {
        const userDetails = SignInSchema.safeParse(req.body)
        
        if(!userDetails.success){
            return res.status(400).json({
                message: "Invalid inputs",
                errors: userDetails.error.errors
            })
        }
    
        const UserExist = await db.query.user.findFirst({
            where: (user, {eq}) => eq(user.email,userDetails.data.email,)
        })
    
        if(!UserExist){
            return res.status(401).json({
                message: "User Does not exist. Please signup !"
            })
        }
    
        const passwordCompare = await bcrypt.compare(userDetails.data.password,UserExist.password)
    
        if(!passwordCompare){
            return res.status(401).json({
                message: "Incorect password! please enter correct password"
            })
        }
        
        
    
        // check user password and get userId   
        const token = jwt.sign({
                userId: UserExist.id,
                name: UserExist.name,
                email: UserExist.email
            },
            JWT_SECERET,
            {expiresIn: "7d"}
        )

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,                         // true in prod (HTTPS)
            sameSite: isProd ? "none" : "lax",      // required for subdomains
            domain: isProd ? ".akhilparmar.com" : undefined,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });


        // res.cookie("token",token, {
        //     httpOnly: process.env.NODE_ENV === "production",
        //     secure: false,
        //     sameSite: "lax",
        //     maxAge: 7*24*60*60*1000
        // })
        
        console.log("user Logined in successfully");
        return res.json({
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function userSignUpRoute(req: Request, res: Response){
    try {
        const userDetails = CreateUserSchema.safeParse(req.body)
    
        if(!userDetails.success){
            return res.status(400).json({
                message: "Invalid inputs",
                errors: userDetails.error.errors
            })
        }
    
        const userExist = await db.query.user.findFirst({
           where: (user, {eq}) => eq(user.email,userDetails.data.email)
        })
    
        if(userExist){
            return res.status(409).json({
                message: "User already exists"
            })
        }
    
        const bcryptPassword = await bcrypt.hash(userDetails.data.password,SALT_ROUNDS)
    
        const NewUser =  await db.insert(user).values({
            email: userDetails.data.email,
            name: userDetails.data.name,
            password: bcryptPassword
        }).returning({id: user.id})
    
    

        const token = jwt.sign({
                userId: NewUser[0]?.id,
                name: userDetails.data.name,
                email: userDetails.data.email
            },
            JWT_SECERET,
            {expiresIn: "7d"}
        )


        const isProd = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,                         // true in prod (HTTPS)
            sameSite: isProd ? "none" : "lax",      // required for subdomains
            domain: isProd ? ".akhilparmar.com" : undefined,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    
        return res.json({
            message: "User created successfully",
            token: token
        })
       } catch (error) {
        console.log("Sign up error:", error)
        return res.status(500).json({ message: "Internal server error", error: String(error) })
       }
}

export function userSignOutRoute(req: Request, res: Response){
    try {

        const isProd = process.env.NODE_ENV === "production";
        res.clearCookie("token",{
            domain: isProd ? ".akhilparmar.com" : undefined,
        })
        return res.json({
            message: "User logged out"
        })
    } catch (error) {
        console.log(error)
    }
}