"use server";

import ConnectDB from "@/backend-utilities/ConnectDB";
import Promo from "@/backend-utilities/models/PromoCodeModel";

export default async function VerifyPromoCode(promoCode) {
    try {
        await ConnectDB();
        const found_promo = await Promo.findOne({ promoCode: promoCode });

        if (!found_promo || found_promo?.leftUses === 0) throw new Error(`Invalid Promo Code! ${promoCode}`);

        // If above checked passed it means valid promo code!

        // WILL ONLY DECREMENT leftUses after code has been actually used after checkout!

        console.log("Discount percent:",found_promo.discountPercentage)
        return {
            success: true,
            discountPercentage: found_promo.discountPercentage
        }




    }
    catch (err) {
        console.error("Failed Promo Code verification at VerifyPromoCode! Logs: ", err?.message);

        return {
            success: false
        }


    }


}