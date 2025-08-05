import Users from "@/backend-utilities/models/UserModel";
import ConnectDB from "@/backend-utilities/ConnectDB";
import mongoose from "mongoose";
// THIS FUNCTION CHECKS WHETHER USER IS ADMIN OR NOT!

export default async function CheckAdmin(USER_EMAIL) {
    
    if(!USER_EMAIL) throw new Error("No EMAIL was provided!");

    try {
        await ConnectDB();
        const user = await Users.findOne({ email: USER_EMAIL });
        if (user && user?.isAdmin) {
            console.log(`Admin access granted to ${user.email}`);
            return true;  // RETURN TRUE IF USER IS AN ADMIN

        }


        return false; // RETURN FALSE IF ABOVE CHECK HASN'T BEEN PASSED! (MEANS USER ISNT ADMIN)

    }
    catch (err) {

        console.error("Error while checking for admin at CheckAdmin! Logs:", err.message);
        //return false if cant check for admin to avoid making everyone an admin if error lol
        return false;


    }

}