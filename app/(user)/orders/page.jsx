import GetOrderByEmail from "@/backend-utilities/order-related/GetOrdersByEmail";
import YourOrdersPage from "@/components/order-page/orderpage";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function YOUR_ORDERS_PAGE() {

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect('/login?message=Please login (or signup) first to proceed &redirect=/orders');
  }

  // If theres an error while finding orders it will return empty array []!
  const orders = await GetOrderByEmail(session.user.email);

  return <YourOrdersPage orders={orders} />

}