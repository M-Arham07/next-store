import GetAllOrders from "@/backend-utilities/GetAllOrders";
import ManageOrdersPage from "@/components/admin/adminorderpage/admin-order";


export default async function AdminOrders(){

  // Get All orders:
const allOrders = await GetAllOrders();

  return <ManageOrdersPage allOrders={allOrders} />
}