import { AddUsersToCanvasSchema, CreateCanvasSchema } from "@repo/common/types";
import { db } from "@repo/db/db";
import { canvas, canvasUsers, chat, user } from "@repo/db/schema";
import type { Request, Response } from "express";
import { and, eq, exists } from "drizzle-orm";
import { redisPublisher } from "@repo/redis/client";
import { ca } from "zod/locales";


export async function createCanvasRoute(req: Request,res: Response) {
    try {
        
        const data =  CreateCanvasSchema.safeParse(req.body);

        if(!data.success){
            return res.status(400).json({
                message: "Invalid inputs"
            })
        }

        if(!req.userId){
            return res.status(401).json({
                message: "Unauthorized access"
            })
        }

        if (!data.data.name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const Newcanvas = await db.insert(canvas).values({
            name: data.data.name,
            adminId: req.userId
        }).returning({id:canvas.id})

        return res.json({
            canvasId: Newcanvas[0]!.id
        })

    } catch (error) {
        console.log(error)
    }
}

export async function AddUsersToCanvasRoute(req: Request, res: Response) {
    try {
        
        const data = AddUsersToCanvasSchema.safeParse(req.body);
        const {id} = req.params

        if(!data.success){
            return res.status(400).json({
                message: "Invalid inputs",
            })
        }
       
        if(!req.userId || !id){
            return res.status(401).json({
                message: "Unauthorized access"
            })
        }

        const canvasExist = await db.query.canvas.findFirst({
            where: (canvas, {eq}) => eq(canvas.id, parseInt(id))
        })

        if(!canvasExist){
            return res.status(404).json({
                message: "Canvas not found"
            })
        }

        if(canvasExist.adminId !== req.userId){
            return res.status(403).json({
                message: "Unauthorized access",
            })
        }
        
        let newMemberId=req.userId;
        if(data.data.email !== undefined && data.data.email !== null){
            const foundUser = await db.query.user.findFirst({
                where: (user, { eq }) => eq(user.email, data.data.email as string)
            })

            if(!foundUser){
                return res.status(404).json({
                    message: "User not found",
                    userAlreadyMember: false,
                    userAdded: false,
                    userNotExists: true
                })
            }
            newMemberId = foundUser.id
        }
        
        const userAlreadyMember = await db.query.canvasUsers.findFirst({
            where: (canvasUsers, {eq}) => eq(canvasUsers.memberId, newMemberId)
        })

        if(userAlreadyMember){
            return res.status(409).json({
                message: "User already member",
                userAlreadyMember: true,
                userAdded: false,
                userNotFound: false
            })
        }

        await db.insert(canvasUsers).values({
            canvasId: canvasExist.id,
            memberId: newMemberId
        })

        return res.json({
            message: "User added to canvas",
            userAlreadyMember: false,
            userAdded: true,
            userNotFound: false
        })
    } catch (error) {
        console.log("Add user to canvas error:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}


export async function deleteUserFromCanvasRoute(req: Request, res: Response) {
    try {
        const {id,canvasId} = req.params

        if(!id || !canvasId){
            return res.status(400).json({
                message: "params missing"
            })
        }

        if(!req.userId) {
            return res.status(401).json({
                message: "Unauthorized access"
            })
        }

        const canvasExist = await db.query.canvas.findFirst({
            where: (canvas, {eq}) => eq(canvas.id, parseInt(canvasId))
        })

        if(!canvasExist){
            return res.status(404).json({
                message: "Canvas does not exist"
            })
        }

        const isUserAdmin = await db.query.canvas.findFirst({
            where: (canvas, {eq}) => (
                and (
                    eq(canvas.id, parseInt(canvasId)),
                    eq(canvas.adminId, req.userId!)
                )
            )
        })
        
        if(!isUserAdmin){
            return res.status(403).json({
                message: "Unauthorized access"
            })
        }

        const isUserMember = await db.query.canvasUsers.findFirst({
            where: (canvasUsers, {eq}) => (
                and (
                    eq(canvasUsers.canvasId,canvasExist.id),
                    eq(canvasUsers.memberId,id)
                )
            )
        })

        if(!isUserMember){
            return res.status(404).json({
                message: "User not found",
                userNotFound: true
            })
        }

        const deletedMember = await db.delete(canvasUsers).where(
            and(
                eq(canvasUsers.canvasId,canvasExist.id),
                eq(canvasUsers.memberId,id)
            )
        ).returning()

        return res.json({
            deletedMember,
            message: "User removed successfully"
        })

    }catch (error) {
        console.log("Delete user from canvas error:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}


export async function getAllCanvasRoute(req: Request, res: Response) {
    try {
         if(!req.userId){
            return res.status(401).json({
                message: "Unauthorized access"
            })
        }

        const cacheKey = `canvases:${req.userId}`;
        
        const cacheData = await redisPublisher.get(cacheKey);
        
        if(cacheData){
            return res.json(JSON.parse(cacheData))
        }

        const canvases = await db.query.canvas.findMany({
            where: (canvas,{eq}) => eq(canvas.adminId,req.userId!),
            with: {
                canvasUsers: {
                    with: {
                        user: {
                            columns: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                admin: {
                    columns: {
                        email: true,
                        name: true
                    }
                }
            }
        })

        const memberCanvas = await db.query.canvas.findMany({
            where: (canvas,{eq}) => 
                exists(
                    db.select().from(canvasUsers).where(
                        and(
                            eq(canvasUsers.canvasId,canvas.id),
                            eq(canvasUsers.memberId,req.userId!)
                        )
                    )
                ),
                with: {
                    canvasUsers: {
                        columns: {
                            memberId: false,
                            canvasId: false,
                            id: true
                        },
                        with: {
                            user: {
                                columns: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    },
                    admin: {
                        columns: {
                            email: true,
                            name: true
                        }
                    }
                }
        })

        await redisPublisher.set(cacheKey,JSON.stringify({canvases,memberCanvas}),"EX",60)

        return res.json({
           canvases,
           memberCanvas
        })
    } catch (error) {
        console.log("Get all canvas error:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function getCanvasByIdRoute(req: Request, res: Response) {
    try {
        
        const {id} = req.params

        if(!req.userId || !id){
            return res.status(401).json({
                message: "Unauthorized access"
            })
        }

        const canvasExist = await db.query.canvas.findFirst({
            where: (canvas, {eq}) => eq(canvas.id, parseInt(id)),
            with: {
                canvasUsers: true,
                admin: {
                    columns: {
                        email: true,
                        name: true
                    }
                }
            }
        })



        if(!canvasExist){
            return res.status(404).json({
                message: "Canvas not found"
            })
        }

        if(canvasExist.adminId !== req.userId){
            return res.status(403).json({
                message: "Unauthorized access"
            })
        }

        return res.json({
            canvas: canvasExist
        })


    } catch (error) {
        console.log("Get canvas by id error:", error)
        return res.status(500).json({ message: "Internal server error" })
    }

}



export async function deleteCanvasRoute(req: Request, res: Response) {
    try {
        const {id} = req.params

        if(!req.userId || !id){
            return res.status(401).json({
                message: "Unauthorized access"
            })
        }


        const canvasExist = await db.query.canvas.findFirst({
            where: (canvas, {eq}) => eq(canvas.id, parseInt(id))
        })

        if(!canvasExist){
            return res.status(404).json({
                message: "Canvas not found"
            })
        }

        if(canvasExist.adminId !== req.userId){
            return res.status(403).json({
                message: "Unauthorized access"
            })
        }

        const remainingCanvas = await db.transaction(async (tx) => {
            await tx.delete(canvas).where(eq(canvas.id,canvasExist.id))

            return await tx.select().from(canvas).where(eq(canvas.adminId,req.userId!))
        })

        await db.delete(canvas).where(eq(canvas.id,canvasExist.id)).returning()
        return res.json({
            canvas: remainingCanvas
        })
        
    } catch (error) {
        console.log("Delete canvas error:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}