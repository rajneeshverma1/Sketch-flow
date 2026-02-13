"use client";

import { useEffect, useState } from "react";
import LogoutModal from "../modals/LogoutModal";
import CreateRoomModal from "../modals/CreateRoomModal";
import DeleteCanvasModal from "../modals/DeleteCanvsModal";
import JoinCanvasModal from "../modals/JoinCanvasModal";
import AddMemberCanvasModal from "../modals/AddMemberCanvasModal";
import UserListModal from "../modals/UserListModal";


const ModalProider = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    },[])
    if (!isMounted) {
        return null;
    }    
    return (
        <>
            <UserListModal />
            <LogoutModal />
            <CreateRoomModal />
            <DeleteCanvasModal />
            <JoinCanvasModal />
            <AddMemberCanvasModal />
        </>
    )
}

export default ModalProider