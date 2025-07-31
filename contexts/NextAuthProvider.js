"use client";
import { SessionProvider } from "next-auth/react";


export default function AUTH_SESSION_PROVIDER({children}){

    return <SessionProvider>{children}</SessionProvider>


}