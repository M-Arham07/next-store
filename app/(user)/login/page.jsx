import { GoogleLoginButton, GitHubLoginButton } from "@/components/loginpage/LoginButtons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image';






export default async function LOGIN({ searchParams }) {
  
  let message = "Welcome to O2 Store";
  let redirectUrl = "/products";
  try {

    const params = await searchParams;


    message = decodeURIComponent(params?.message || "").trim()

    redirectUrl = params.redirect;
    // supported messages list so user doesent tamper:
    const supported_messages = ["Welcome to O2 Store", "Please login (or signup) first to proceed"];


    const supported_redirects = ["/products", "/checkout"];

    if (!supported_messages.includes(message)) { message = "Welcome to O2 Store" }

    if (!supported_redirects.includes(redirectUrl)) redirectUrl = "/products";
  }
  catch(err){
    // if someone tampers with URL, a URI malformed error might be thrown, so i implemented try catch
    message="Welcome to O2 Store";
    redirectUrl="/products"
  }
  







  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full mb-30 max-w-sm mx-4 shadow-lg border-2">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{message}</CardTitle>
          <CardDescription>Sign in to your O2 Store account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-center mb-4">
            <Image src="/brand.png" alt="O2 Store Logo" width={120} height={120} className="rounded-full" />
          </div>
          <GoogleLoginButton redirectUrl={redirectUrl} />

          <GitHubLoginButton redirectUrl={redirectUrl} />
        </CardContent>
      </Card>
    </div>
  )
}
