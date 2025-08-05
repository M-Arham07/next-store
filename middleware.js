import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";

export default async function middleware(request) {

    const secret = process.env.NEXTAUTH_SECRET;

    const token = await getToken({ req: request, secret });


    console.log("THE TOKEN OBJECT IS",token)


    console.log("HELLO FROM THE EDGE!");
    return new NextResponse(`

         <!DOCTYPE html>
      <html>
        <head>
          <title>403 - Forbidden</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: #d32f2f; }
            p{color:white;}
          </style>
        </head>
        <body bgcolor="black">
          <h1>403 - Forbidden</h1>
          <p>You don't have permission to access this resource.</p>
          <a href="/">Return to Home</a>
        </body>
      </html>


        `, {
        status: 403,
        headers: {
            "Content-Type": 'text/html'
        }

    })
}


export const config = {
    matcher: ["/admin/:path*"] // RUN MIDDELWARE ONLY ON /admin and all its subpaths! :
}