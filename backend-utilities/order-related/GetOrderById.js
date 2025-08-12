
import GetOrderByEmail from "@/backend-utilities/order-related/GetOrdersByEmail";
import { unstable_cache } from "next/cache";



// This function accepts email of the logged in user and orderId 
// to get the order for current user by order id.

// If the session email doesent have an order with the given order id, it will return false;

const GetOrderById = unstable_cache(
    async (email, orderId) => {

        try {

            /* find all orders for the given email, 
               if no order exist an empty array will be returned, and using find on an empty
               array will result in undefined!*/
            const orders = await GetOrderByEmail(email);

            // find the matchedOrder in orders array to find the requested order!
            const matchedOrder = orders.find(order => order.orderId === orderId);


            // if matchedOrder is undefined (no matched order)
            if (!matchedOrder) {
                throw new Error(`No order for ${email} with order id ${orderId} was found!`)
            }

            return matchedOrder;


        }

        catch (err) {
            console.error("Error while finding order at GetOrderById! Logs:", err?.message);
            return false;

        }

    },
    ['track-user-orders'],
    { tags: ['orders'] }
)
export default GetOrderById;