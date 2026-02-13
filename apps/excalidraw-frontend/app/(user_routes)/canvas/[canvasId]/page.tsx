import CanvasBoard from "@/components/CanvasBoard";
import { getUserId } from "@/lib/getDetails";
import { isUserMemberOrAdmin } from "@/lib/isUserMember";
import { cookies } from "next/headers";

const Canvas = async ({
    params
}: {
     params: Promise<{ canvasId: string }>;
}) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    const {canvasId} = await params;

    // Check token first
    if(!token){
        return <div>Please log in to access the canvas.</div>
    }

    // Check canvasId
    if(!canvasId){
        return <div>No Canvas ID Provided</div>
    }

    // Get userId from token
    const userId = getUserId(token);

    // Check if userId was successfully extracted
    if (!userId) {
        return <div>Invalid authentication token. Please log in again.</div>
    }

    // Now check authorization
    const hasAccess = await isUserMemberOrAdmin(
        userId,
        canvasId
    );

    if (!hasAccess) {
        return <div>You are not authorized to access this canvas</div>;
    }

    return ( 
        <CanvasBoard className="h-full w-full overflow-hidden" canvasId={canvasId} token={token} />
     );
}
 
export default Canvas;