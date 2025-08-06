import ConnectDB from "@/backend-utilities/ConnectDB";
import Users from "@/backend-utilities/models/UserModel";
import mongoose from "mongoose";

/* THIS FUNCTION CHECKS IF THE USER EXISTS BEFORE RETURNING SESSION
   FOR EXAMPLE, IF USER HAS BEEN DELETED, HE WILL BE LOGGED OUT AUTOMATICALLY ON RELOAD
   BECAUSE SESSION IS PROVIDED ON EVERY RELOAD
 */
export default async function CheckIfExist(EMAIL) {

    try {
        if (!EMAIL) throw new Error("No Email provided!")

        await ConnectDB();
        const isExist = await Users.findOne({ email: EMAIL });

        return isExist ? true : false;

    }
    catch (err) {
        console.error("Error while trying to check if user exists at CheckIfExist! Logs:", err?.message);
        return false;
    }


}