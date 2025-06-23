import Sidebar from "@/components/jobseeker/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContex";
import NotificationBell from "@/components/common/NotificationBell";

const JobseekerLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="max-[768px]:hidden">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 max-[768px]:ml-0">
        <header className="h-16 bg-white/90 shadow-sm sticky top-0 z-10 backdrop-blur-md">
          <div className="h-full px-6 flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-900 transition-all duration-300">
              Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome back,{" "}
                <span className="font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200">
                  {user?.firstName}
                </span>
              </span>
              <NotificationBell />
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer">
                {user?.firstName?.[0]}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobseekerLayout;
