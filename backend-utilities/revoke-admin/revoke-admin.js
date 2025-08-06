"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import ConnectDB from "@/backend-utilities/ConnectDB";
import Users from "@/backend-utilities/models/UserModel"
import mongoose from "mongoose";


export default async function RevokeAdmin(_id) {
    /*
    BEFORE REVOKING ACCESS, LETS VERIFY IF THE REVOKER IS ACTUALLY AN ADMIN
    WE CAN USE SESSION FOR IT!
    */

    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error(`Received Invalid ObjectID: ${_id}`);


        const session = await getServerSession(authOptions);

        if(!session) throw new Error("No session!");

        await ConnectDB();

        // CHECK IF CURRENT SESSION'S EMAIL IS A SUPERUSER
        const requester = await Users.findOne({email: session?.user?.email}).lean();
  

        if (!requester?.isSuperuser) throw new Error(`${session?.user?.email} is not a superuser! Access denied`);

        // ABOVE CHECK PASSED, NOW REVOKE ACCESS FOR THE REQUESTED ADMIN!
        const revokedAdmin = await Users.findByIdAndUpdate(
            { _id: _id },
            { $set: { isAdmin: false } },
            { new: true }
        );
        console.log("Revoked Admin Access for", revokedAdmin?.email);

        return true;

    }
    catch (err) {
        console.error("Error while revoking admin access at RevokeAdmin! Logs:", err?.message);
        return false;

    }



}