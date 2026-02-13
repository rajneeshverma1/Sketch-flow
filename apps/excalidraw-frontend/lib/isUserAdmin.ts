"use server"
import {db} from "@repo/db/db"
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export async function isUserAdmin(token: string, canvasId: string) {
    try {
        if (!token || !canvasId) {
            return false;
        }

        const decoded = jwt.decode(token) as jwt.JwtPayload;
        const userId = decoded?.userId;
        
        if (!userId) {
            return false;
        }
        
        const result = await db.query.canvas.findFirst({
            where: (c, {eq, and}) =>
                and(
                    eq(c.id, Number(canvasId)),
                    eq(c.adminId, userId)
                )
        })
        
        return !!result;

    } catch (error) {
        console.log("❌ isUserAdmin error:", error)
        return false;
    }
}