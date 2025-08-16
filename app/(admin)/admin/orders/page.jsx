import GetAllOrders from "@/backend-utilities/GetAllOrders";
import ManageOrdersPage from "@/components/admin/adminorderpage/ManageOrdersPage";
import { revalidatePath } from "next/cache";


export default async function AdminOrders(){

  // Get All orders:
const allOrders = await GetAllOrders();

  return <ManageOrdersPage allOrders={allOrders} />
}