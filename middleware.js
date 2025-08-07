import { NextResponse } from "next/server";



export default async function middleware(request) {


    const forbidden_html_page = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 - Access Forbidden</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background-color: #000;
            color: #fff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .error-container {
            text-align: center;
            max-width: 500px;
            padding: 40px 20px;
        }

        .error-code {
            font-size: 120px;
            font-weight: 900;
            color: #ff0000;
            line-height: 1;
            margin-bottom: 20px;
        }

        .error-title {
            font-size: 32px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 16px;
        }

        .error-message {
            font-size: 18px;
            color: #ccc;
            margin-bottom: 40px;
            line-height: 1.6;
        }

        .home-link {
            display: inline-block;
            background-color: #fff;
            color: #000;
            text-decoration: none;
            padding: 12px 24px;
            border: 2px solid #fff;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .home-link:hover {
            background-color: #000;
            color: #fff;
            border-color: #ff0000;
        }

        @media (max-width: 768px) {
            .error-code {
                font-size: 80px;
            }

            .error-title {
                font-size: 24px;
            }

            .error-message {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-code">403</div>
        <h1 class="error-title">Access Forbidden</h1>
        <p class="error-message">
            You don't have permission to access this resource.
        </p>
        <a href="/" class="home-link">Back to Home</a>
    </div>
</body>
</html>`

    try {
        // VERIFY ADMIN BY SENDING GET REQUEST TO API:

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-admin`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "cookie": request.headers.get("cookie") || "", // forward session cookie to access getServerSession on route!
            }
        });

        if(!res.ok){
            throw new Error("Received Bad response from API! Admin access denied!")
        }


        const data = await res.json();
        const {role,email} = data;


        // IF ALL ABOVE CHECKS ARE PASSED, MEANS USER IS ADMIN SO ALLOW ADMIN ROUTE!

        // THIS ESCAPE SEQUENCE MAKES TEXT GREEN!:
        console.log(`\x1b[32m${role.toUpperCase()} access granted to ${email}\x1b[0m`); 

        // CONTINUE TO ADMIN ROUTE:
        return NextResponse.next();


    }
    catch (err) {
       
        // COOL RED ERROR:
        console.error(`\x1b[31m Admin verification failed at middleware! Logs:, ${err?.message} \x1b[0m`);

        return new NextResponse(forbidden_html_page, {
            status: 403,
            headers: {
                "Content-Type": "text/html"
            }
        }
        )
    }
}

export const config = {
    matcher: ["/admin/:path*"] // RUN MIDDELWARE ONLY ON /admin and all its subpaths! :
}