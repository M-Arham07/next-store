"use client";

import { createContext } from "react";

import useOrderManager from "@/hooks/useOrderManager";



export const OrderManagerContext = createContext();

export default function OrderManagerProvider({ children }) {



    return <OrderManagerContext.Provider value={useOrderManager()}>{children}</OrderManagerContext.Provider>




}