import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminDashboard from "@/components/admin/dashboard/dashboard";
import { getServerSession } from "next-auth";
import GetProducts from "@/backend-utilities/GetProducts";
import GetAllUsers from "@/backend-utilities/GetAllUsers";
import GetAllOrders from "@/backend-utilities/GetAllOrders";






export default async function ADMIN_DASHBOARD() {
 
 
    const session = await getServerSession(authOptions);

    // THESE ALL ARE CACHED FUNCTIONS :

    const allUsers = await GetAllUsers();
    const allProducts = await GetProducts();
    const allOrders = await GetAllOrders();
    
    

    
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
  

    
    // Calculate orders this month and last month
    const ordersThisMonth = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
        )
    });

    const ordersLastMonth = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return (
            orderDate.getMonth() === lastMonth.getMonth() &&
            orderDate.getFullYear() === lastMonth.getFullYear()
        )
    });

    // Calculate percentage change
    const orderChange = ordersLastMonth.length > 0 
        ? (((ordersThisMonth.length - ordersLastMonth.length) / ordersLastMonth.length) * 100).toFixed(1)
        : "100";

    const STATS = {
        TOTAL_USERS: allUsers.length ?? "No Data. Please reload the page",
        TOTAL_PRODUCTS: allProducts.length ?? "No Data. Please reload the page",
        ProdChange: productsAddedThisMonth.length - productsAddedLastMonth.length,
        TOTAL_ORDERS: allOrders.length,
        OrderChange: orderChange // Add this
    }


    return <AdminDashboard
        adminName={session.user.name}
        STATS = {STATS}
    />
}