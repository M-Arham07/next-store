import { unstable_cache } from "next/cache";
import ConnectDB from "@/backend-utilities/ConnectDB";
import Orders from "@/backend-utilities/models/OrdersModel";


const GetAllOrders = unstable_cache(
    async () => {

        try {

            await ConnectDB();
            const allOrders = await Orders.find().lean();
            return allOrders;

        }
        catch (err) {
            console.error("Error while fetching all orders at GetAllOrders! Logs:", err?.message);
            return [];

        }


    },
    ['orders'],
    { tags: ['orders'] }
);

export default GetAllOrders;