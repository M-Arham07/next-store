import GetAllOrders from "@/backend-utilities/GetAllOrders";
import AdminOrderOverview from "@/components/admin/adminorderpage/admin-order-overview";
import { notFound } from "next/navigation";


export default async function ADMIN_ORDER_OVERVIEW({ params }) {
  const awaitedParams = await params;
  const orderId  = awaitedParams?.orderid;


  // Return if no order id was found!
  if(!orderId) return notFound();

  const allOrders = await GetAllOrders();


  // Destructure the foundOrder array to an Object
  const [foundOrder] = allOrders.filter(order => order.orderId === orderId);

  // If no found order:
  console.log(foundOrder)
  if(!foundOrder || foundOrder.length === 0) return notFound();



  return <AdminOrderOverview currentOrder={foundOrder} />
}