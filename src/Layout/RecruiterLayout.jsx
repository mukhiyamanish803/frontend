import Sidebar from "@/components/recruiter/Sidebar";
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { HiUser } from "react-icons/hi";
import NotificationBell from "@/components/common/NotificationBell"; // added import
import { useAuth } from "@/context/AuthContex";

const getPageTitle = (pathname) => {
  const routes = {
    "/recruiter/dashboard": "Dashboard",
    "/recruiter/candidates": "Candidates",
    "/recruiter/jobs": "Jobs",
    "/recruiter/jobs/create": "Post Job",
    "/recruiter/company/profile": "Company Profile",
    "/recruiter/company/documents": "Documents",
    "/recruiter/company/team": "Team Members",
    "/recruiter/messages": "Messages",
    "/recruiter/settings": "Settings",
  };
  return routes[pathname] || "Dashboard";
};

const RecruiterLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="mt-2 mr-2 backdrop-blur-md bg-white/70 shadow-lg rounded-xl h-20 flex items-center justify-between px-10 flex-shrink-0 sticky top-0 z-20 border-b border-slate-100">
          <h1 className="text-2xl font-light tracking-tight text-gray-900 drop-shadow-sm">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-6">
            <NotificationBell />
            <div className="h-8 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-100 mx-2" />
            <span
              className="h-11 w-11 flex items-center justify-center rounded-full font-semibold text-lg text-gray-800 bg-gradient-to-br from-purple-100 via-sky-100 to-teal-100 border-2 border-transparent hover:border-purple-300 transition-all duration-200 shadow-md cursor-pointer select-none"
              title={`${user?.firstName} ${user?.lastName}`}
            >
              {(user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto my-2">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
