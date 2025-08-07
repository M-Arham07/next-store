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
    
    

    const THIS_MONTH_PRODUCTS = allProducts.filter(product=>(
        (new Date(product.createdAt)).getMonth() + 1 === (new Date).getMonth() + 1
    ))

    // ProdIncrease == products added in this month
    // const ProdIncrease = allProd


    return <AdminDashboard
        adminName={session.user.name}
        TOTAL_USERS={allUsers.length ?? "No Data. Please reload the page"}
        TOTAL_PRODUCTS={allProducts.length ?? "No data. Please reloas the page"}
    />
}