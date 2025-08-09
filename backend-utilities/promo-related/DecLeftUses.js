

import Promos from "@/backend-utilities/models/PromoCodeModel";
import ConnectDB from "@/backend-utilities/ConnectDB";


/* This function decrements the left uses of promo code every 
        time a order with promo code is placed! */

export default async function DecLeftUses(promoCode) {

    try {
        await ConnectDB();
        await Promos.findOneAndUpdate(
            { promoCode: promoCode },
            { $inc: { leftUses: -1 } }, //decrements leftUses by -1
            { new: true }
        );


    }
    catch (err) {

        // Directly throw an error so it gets catched by the try catch block of confirmOrder

        throw new Error(
            `Failed to decrement left uses of promo code ${promoCode} at 
            DecLeftUses! Logs: ${err?.message}`)
    }


}