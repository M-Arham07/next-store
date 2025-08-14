import OrderManagerProvider from "@/contexts/OrderManagerProvider";



export default function AdminOrderLayout({ children }) {

    return <OrderManagerProvider> {children} </OrderManagerProvider>
}