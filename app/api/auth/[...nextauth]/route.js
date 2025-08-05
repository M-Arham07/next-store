import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import SaveUsertoDB from "@/backend-utilities/login-related/SaveUsertoDB";
import ConnectDB from "@/backend-utilities/ConnectDB";
import CheckAdmin from "@/backend-utilities/login-related/CheckAdmin";



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
                return isInserted;
            }
            return false; //if user object doesent exist for some reason ;
        },
        jwt: async function ({ token, user }) {
            //CHECK IF USER ADMIN?

            if (user) {
                const isAdmin = await CheckAdmin(user?.email);

                if(isAdmin){
                   //Attach isAdmin:true to token if entered email is an admin email
                    token.isAdmin=true; 
                }

            }
               return token; //ALWAYS RETURN TOKEN!


        }
    },
    secret: process.env.NEXTAUTH_SECRET

}






const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
