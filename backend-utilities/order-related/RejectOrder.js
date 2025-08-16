"use server";

import { revalidateTag } from "next/cache";
import ConnectDB from "../ConnectDB";
import Orders from "@/backend-utilities/models/OrdersModel";

export default async function RejectOrder(orderId, cancelReason, cancelledBy = "user") {

    try {
        if (cancelReason.length < 10) throw new Error("Cancel Reason too short!");

        await ConnectDB();

        const order = await Orders.findOne({ orderId: orderId });
        console.log("Found",order)

        const SUPPORTED_CANCEL_STATUSES = ["processing","confirmed"]

        /* ADMIN CAN CANCEL ORDER AT ANY STEP, USER CAN ONLY CANCEL IF ORDER STATUS
            IS PROCESSING OR CONFIRMED! */
        if (!SUPPORTED_CANCEL_STATUSES.includes(order.status) && cancelledBy === "user") {
            throw new Error("User cannot cancel order at this stage!");

        }

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