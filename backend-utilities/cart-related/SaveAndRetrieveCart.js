"use server";
import mongoose from 'mongoose';
import User from "@/backend-utilities/models/UserModel";
import ConnectDB from '../ConnectDB';



export async function SaveCartToDB(EMAIL, CART_ITEMS) {


    try {


        await ConnectDB();
        console.log()
        // NEW TRUE MEANS TO SHOW THE UPDATED DOCUMENT INSTEAD OF OLD
        const inserted = await User.findOneAndUpdate(
            { email: EMAIL },
            { $set: { cart: CART_ITEMS } },
            { new: true }
        );

        console.log("UPDATED USER", inserted)

    }
    catch (err) {
        console.error("Error while Saving Cart Items at SaveCartToDB! Logs:", err.message);
        // THIS FUNCTION ISNT MUCH IMPORTANT SO NO ERROR SHOWING ETC

    }

}


export async function RetrieveCartfromDB(EMAIL) {
    try {
        await ConnectDB();
        const { cart } = await User.findOne({ email: EMAIL });
        return cart;
    }
    catch (err) {
        console.error("Failed retrieving cart from DATABASE at RetrieveCartfromDB! Logs:", err.message)
    }
}

