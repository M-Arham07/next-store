import OrderConfirmedPage from "@/components/checkout-page/confirmed-page/confirmed-order";
import React from "react";


export default function OrderConfirmed({params}){
 const PARAMS = React.use(params);
 const orderId=params?.orderid || null
 console.log("Params are",PARAMS)

  return (
    <OrderConfirmedPage orderId={orderId} />
  )
}