import ModernNavbar from "@/components/navbar";


export default function UserLayout({ children }) {
    return (
        <>
        <ModernNavbar />
        <main className="p-4 md:p-6">{children}</main>
        </>
    )
}