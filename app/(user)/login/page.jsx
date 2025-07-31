"use client"
import {GoogleLoginButton,  GitHubLoginButton } from "@/components/loginpage/LoginButtons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image';






export default function LOGIN() {
 

 
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-black">
      <Card className="w-full mb-30 max-w-sm mx-4">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome to O2 Store</CardTitle>
          <CardDescription>Sign in to your O2 Store account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-center mb-4">
            <Image src="/brand.png" alt="O2 Store Logo" width={120} height={120} className="rounded-full" />
          </div>
         <GoogleLoginButton />

         <GitHubLoginButton />
        </CardContent>
      </Card>
    </div>
  )
}
