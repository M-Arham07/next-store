import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CheckoutPage from "@/components/checkout-page/checkout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function CHECKOUT_PAGE(){
  const session = await getServerSession(authOptions);

  if(!session?.user){
    // if no session then redirect to login page with following message:
   return redirect('/login?message=Please login (or signup) first to proceed &redirect=/checkout');
   

  }

  return <CheckoutPage session = {session} />
}