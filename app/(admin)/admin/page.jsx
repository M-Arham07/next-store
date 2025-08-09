import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminDashboard from "@/components/admin/dashboard/dashboard";
import { getServerSession } from "next-auth";
import ConnectDB from "@/backend-utilities/ConnectDB";
import Users from "@/backend-utilities/models/UserModel";
import Products from "@/backend-utilities/models/ProductModel";
import { unstable_cache } from "next/cache";
import GetProducts from "@/backend-utilities/GetProducts";
import GetAllUsers from "@/backend-utilities/GetAllUsers";






export default async function ADMIN_DASHBOARD() {
 
 
    const session = await getServerSession(authOptions);

    // BOTH ARE CACHED FUNCTIONS :

    const allUsers = await GetAllUsers();
    const allProducts = await GetProducts();
    
    

    
       // FILTER ALL THOSE PRODUCTS THAT WERE ADDED THIS MONTH (ALSO VERIFY YEAR)

       const now = new Date();
       const productsAddedThisMonth = allProducts.filter(product=>{
         const prodCreation = new Date(product.createdAt);
         return (
            prodCreation.getMonth() === now.getMonth() &&
            prodCreation.getFullYear() === now.getFullYear()

         )

       })

       // THIS HANDLES CASES WHEN CURRENT MONTH JANUARY:

       const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

       const productsAddedLastMonth = allProducts.filter(product=>{
        const prodCreation = new Date(product.createdAt);
        return (
            prodCreation.getMonth() === lastMonth.getMonth() &&
            prodCreation.getFullYear() === lastMonth.getFullYear()
        )

       })

  
    console.log("PRODUCTS ADDED THIS MONTH:",productsAddedThisMonth.length)

                       
    // ProdChange==  (products added this month) - (products added in last month )
  

    const STATS = {

        TOTAL_USERS : allUsers.length ?? "No Data. Please reload the page",
        TOTAL_PRODUCTS : allProducts.length ?? "No Data. Please reload the page",
        ProdChange :productsAddedThisMonth.length - productsAddedLastMonth.length
    }


    return <AdminDashboard
        adminName={session.user.name}
        STATS = {STATS}
    />
}