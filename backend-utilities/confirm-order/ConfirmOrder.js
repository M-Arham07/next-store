"use server";

import ConnectDB from "@/backend-utilities/ConnectDB";
import Orders from "@/backend-utilities/models/OrdersModel";
import VerifyPromoCode from "@/backend-utilities/promo-related/VerifyPromo";
import DecLeftUses from "@/backend-utilities/promo-related/DecLeftUses";
import { revalidateTag } from "next/cache";
import Products from "@/backend-utilities/models/ProductModel";
import UpdateAvailableUnitsAfterOrder from "../UpdateAvailableUnitsAfterOrder";
export default async function ConfirmOrder(orderDetails) {

    // console.log("receievd order details:",{orderId,...orderDetails});

    try {

        await ConnectDB();

        // if a promo code exists: 
        if (orderDetails?.pricing?.discount?.promoCode) {

            // Verify promo Code again

            const Verify = await VerifyPromoCode(orderDetails.pricing.discount.promoCode);

            // if not verified from db throw an error!

            if (!Verify.success) throw new Error("Invalid Promo Code!");

            // If verification for code is a success, verify discount percentage:

            if (orderDetails.pricing.discount.percentage !== Verify.discountPercentage) {
                throw new Error("Wrong discount percentage!");
            }

            // Do the same thing for discountedAmount

            if (orderDetails.pricing.discount.discountedAmount !== (orderDetails.pricing.subtotal * (Verify.discountPercentage / 100))) {

                throw new Error("Invalid discounted price!");
            }

            // DECREMENT LEFT USES OF PROMO CODE AS IT HAS BEEN USED:

            /* If theres an error while decrementing, DecLeftUses will throw an error that will
             be catched by the try catch-block here! */

            await DecLeftUses(orderDetails.pricing.discount.promoCode);

        }

        // If everything above goes well:


        // Generate a random order id:
        const orderId = Math.floor(10000000 + Math.random() * 90000000).toString();

        //Insert order details in database with orderId and status:

        /*If theres any type mismatch or missing required fields, mongoose will automatically
         throw an error! */


         // VERIFY PRODUCT QUANTITY (later):

         


        await Orders.create({ orderId, ...orderDetails, status: 'processing' });

        await UpdateAvailableUnitsAfterOrder(false,orderDetails.orderedItems);


        // Refresh cache for orders!
        revalidateTag('orders');

        return {
            success: true,
            orderId: orderId
        }


    }

    catch (err) {
        console.error("Error while creating order! Logs:", err.message);

        return false;


    }

}