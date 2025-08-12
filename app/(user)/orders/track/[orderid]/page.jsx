import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GetOrderById from "@/backend-utilities/order-related/GetOrderById";
import TrackOrder from "@/components/order-page/track-order";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";



export default async function TrackOrderPage({ params }) {


  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect(`/login?message=Please login (or signup) first to proceed &redirect=/orders`);
  }


  const awaitedParams = await params;
  const orderId = awaitedParams?.orderid;

  

  if(!orderId) return notFound();

  
  // Find Order by order id for this email!
  const matchedOrder = await GetOrderById(session.user.email, orderId);

  // if no matched order return notFound() page!
  if (!matchedOrder) return notFound();

  console.log("sending",matchedOrder)

  return <TrackOrder currentOrder={matchedOrder} />

}