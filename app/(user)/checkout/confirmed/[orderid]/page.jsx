import OrderConfirmedPage from "@/components/checkout-page/confirmed-page/confirmed-order";
import React from "react";


export default async function OrderConfirmed({params}){
 const awaitedParams = await params;
 const orderId=awaitedParams?.orderid || null


  return (
    <OrderConfirmedPage orderId={orderId} />
  )
}