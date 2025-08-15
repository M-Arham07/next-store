"use server";

import { revalidateTag } from "next/cache";
import ConnectDB from "../ConnectDB";
import Orders from "@/backend-utilities/models/OrdersModel";

export default async function RejectOrder(orderId, cancelReason, cancelledBy = "user") {

    try {
        if (cancelReason.length < 10) throw new Error("Cancel Reason too short!");

        await ConnectDB();
        await Orders.findOneAndUpdate(
            { orderId: orderId },
            {
                $set: {
                    status: "cancelled",
                    cancelReason: cancelReason,
                    cancelledBy: cancelledBy,
                    cancelledAt: Date.now()
                }
            },
            { runValidators: true }
        );

        // Revalidate tag to refresh cache!

        revalidateTag("orders");

        console.log(`Rejected order id: ${orderId}`);

        return true;


    }
    catch (err) {
        console.error(`Error while rejecting order id: ${orderId}. Logs: ${err?.message}`);

        return false;


    }


}