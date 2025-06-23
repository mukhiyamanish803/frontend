import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-2">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
