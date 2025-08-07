import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import SaveUsertoDB from "@/backend-utilities/login-related/SaveUsertoDB";
import CheckIfExist from "@/backend-utilities/login-related/CheckIfExist";
import { revalidateTag } from "next/cache";



export const authOptions = {

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        })
    ],

    callbacks: {
        // RUNS WHILE USER SIGNING IN, WE WILL SAVE USER TO DB BEFORE PROCEEDING
        signIn: async function ({ user }) {
            if (user) {
                const isInserted = await SaveUsertoDB(user);
                revalidateTag('users'); // revalidate so GetAllUsers work!
                return !!isInserted; //convert to boolean!
            }
            return false; //if user object doesent exist for some reason ;
        },
        session: async function ({ session, token }) {


            // CHECK IF THE USER EVEN EXISTS BEFORE RETURNING SESSION
            // As session is returned on every reload, this helps if user removed from admin panel!

            if (token?.email) {
                const isExist = await CheckIfExist(token?.email);
                if (!isExist) return null;
            }

            return session;

        }
    },
    secret: process.env.NEXTAUTH_SECRET,

}






const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
