import AdminNavbar from "@/components/admin/admin-navbar";
import { EdgeStoreProvider } from "@/contexts/EdgeStoreProvider";

export default function AdminLayout({ children }) {
  return (<>
    <AdminNavbar />

    <div className="pt-24 sm:pt-20">
      <EdgeStoreProvider>{children}</EdgeStoreProvider>
    </div>

  </>)
}