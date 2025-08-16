import ConnectDB from "@/backend-utilities/ConnectDB";
import Orders from "@/backend-utilities/models/OrdersModel";
import { unstable_cache } from "next/cache";




const GetOrderByEmail = unstable_cache(
    async (email) => {
        try {
            await ConnectDB();
            const userOrders = await Orders.find(
                { "customerDetails.email": email }, { _id: 0 }
            ).populate('orderedItems.product').lean();
            // Populate looks in the products collection and gets each product by id while querying 

            return JSON.parse(JSON.stringify(userOrders));
        }
        catch (err) {

            console.error("Error while fetching user orders at GetOrderByEmail! Logs:", err.message);

            return [];


        }

    }, 
    ['user-orders'],
    { tags: ['orders'] }
)

export default GetOrderByEmail;