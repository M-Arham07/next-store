"use server";

import mongoose from "mongoose";
import ConnectDB from "@/backend-utilities/ConnectDB";
import Users from "@/backend-utilities/models/UserModel";


export default async function DeleteUser(_id) {
    

    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error(`Invalid ObjectId: ${_id}`);

        await ConnectDB();
        await Users.deleteOne({ _id: _id });
        return true;


    }

    catch (err) {

        console.error(`Error while deleting user with _id:${_id} at DeleteUser! Logs:`, err.message);
        return false;


    }
}