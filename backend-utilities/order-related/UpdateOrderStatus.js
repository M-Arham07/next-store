"use server";

import ConnectDB from "@/backend-utilities/ConnectDB";
import Orders from "@/backend-utilities/models/OrdersModel";
import { revalidateTag } from "next/cache";


// This function will increment the order status!
export default async function UpdateOrderStatus(orderId, newStatus) {


    try {
        const statusFlow = ["processing", "confirmed", "shipped", "out for delivery", "delivered"];

        if (!statusFlow.includes(newStatus)) throw new Error(`${newStatus} isn't in statusFlow`);

        await ConnectDB();
        const order = await Orders.findOne({ orderId: orderId });


        // CHECK THE NEXT POSSIBLE STATUS OF order:

        const supportedNextStatus = statusFlow[statusFlow.indexOf(order.status) + 1];

        if (newStatus !== supportedNextStatus) throw new Error(`Unsupported new status: ${newStatus}`);


        // UPDATE THE ORDER STATUS:

        // CHECK IF THE ORDER STATUS IS DELIVERED? IF DELIVERED THEN INSERT deliveredAt field!


        let updateFields = { status: newStatus };

        // Insert deliveredAt if newStatus is delivered:

        if (newStatus === "delivered") updateFields.deliveredAt = new Date();

        await Orders.findOneAndUpdate(
            { orderId: orderId },
            { $set: updateFields }
        );

        // REVALIDATE TAG TO REFRESH CACHE!

        revalidateTag("orders");


        console.log(`Updated status of orderId:${orderId} from ${order.status} to ${newStatus}`);

        return true;




    }
    catch (err) {

        console.error(
            `Error while updating order status of orderId:${orderId} at
              UpdateOrderStatus! Logs:${err?.message}`
        );

        return false;


    }


} 