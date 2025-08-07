// This  will be called in server component so no need for use server

import ConnectDB from "@/backend-utilities/ConnectDB";
import Users from "@/backend-utilities/models/UserModel";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";




const GetAllUsers = unstable_cache(
    async () => {
        try {
            await ConnectDB();
            const rawUsers = await Users.find();
            const parsedUsers = JSON.parse(JSON.stringify(rawUsers));
            return parsedUsers;
        }
        catch (err) {
            console.error("Error while getting all users from database at GetAllUsers! Logs", err.message);
            return false;
        }


    },
    ['users'],{
    tags:['users']
    }

);

export default GetAllUsers;