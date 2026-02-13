"use server"
import {db} from "@repo/db/db"
import { canvasUsers } from "@repo/db/schema";
import { and, eq, exists, or } from "drizzle-orm";

export async function isUserMemberOrAdmin(userId: string | null, canvasId: string) {
    try {
        // Validate inputs
        if (!userId || !canvasId) {
            console.log("❌ Invalid userId or canvasId:", { userId, canvasId });
            return false;
        }
        
        const result = await db.query.canvas.findFirst({
            where: (c) =>
                or(
                   and(eq(c.id, Number(canvasId)), eq(c.adminId, userId)),

                   and(
                    eq(c.id, Number(canvasId)),
                    exists(
                        db.select().from(canvasUsers).where(
                            and(
                                eq(canvasUsers.canvasId, c.id),
                                eq(canvasUsers.memberId, userId)
                            )
                        )
                    )
                   )
                )
        })
        
        console.log("✅ Authorization check:", { 
            userId, 
            canvasId, 
            hasAccess: !!result 
        });
        
        return !!result;

    } catch (error) {
        console.log("❌ Authorization error:", error)
        return false;
    }
}