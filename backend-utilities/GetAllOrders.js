import { unstable_cache } from "next/cache";
import ConnectDB from "@/backend-utilities/ConnectDB";
import Orders from "@/backend-utilities/models/OrdersModel";


/* This function is only for use in admin panel! 
   It finds all orders in the orders collection and returns them as an OBJECT

*/

const GetAllOrders = unstable_cache(
    async () => {


        try {

            await ConnectDB();
            const allOrders = await Orders.find().populate("orderedItems.product").lean();

            
            return JSON.parse(JSON.stringify(allOrders));

        }
        catch (err) {
            console.error("Error while fetching all orders at GetAllOrders! Logs:", err?.message);
            return [];

        }


    },
    ['all-orders'],
    { tags: ['orders'] }
);

export default GetAllOrders;