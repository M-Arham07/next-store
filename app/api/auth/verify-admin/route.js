import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ConnectDB from "@/backend-utilities/ConnectDB";
import Users from "@/backend-utilities/models/UserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET(request) {


    try {
        const session = await getServerSession(authOptions);
        if (!session) throw new Error("No Session found!");

        await ConnectDB();
        const found_user = await Users.findOne({ email: session.user.email });

       

        const ALLOWED_ROLES = ['admin', 'superuser'];

        if (!ALLOWED_ROLES.includes(found_user?.role)) {
            throw new Error(`${session.user.email} is not an admin/superuser! Access denied`)
        }

        // AS ABOVE CHECKS ARE PASSED, NOW RETURN STATUS 200
        return NextResponse.json({ role: `${found_user.role}`, email: session.user.email, success: true }, { status: 200 });


    }
    catch (err) {
        console.error("Admin Verification failed at /api/verify-admin route! Logs:", err?.message);
        return NextResponse.json({ success: false }, { status: 403 });
    }



}