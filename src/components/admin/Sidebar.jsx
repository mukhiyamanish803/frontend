import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContex";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/context/SidebarContext";
import {
  LuLayoutDashboard,
  LuUsers,
  LuBriefcase,
  LuGraduationCap,
  LuTrophy,
  LuSettings,
  LuList,
  LuLogOut,
  LuFolders,
  LuPhone,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { PiBuildingApartmentFill } from "react-icons/pi";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LuLayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: LuUsers,
  },
  {
    name: "Companies",
    href: "/admin/companies",
    icon: PiBuildingApartmentFill,
  },
  {
    name: "Jobs",
    href: "/admin/jobs",
    icon: LuBriefcase,
  },
  {
    name: "Internships",
    href: "/admin/internships",
    icon: LuGraduationCap,
  },
  {
    name: "Hackathons",
    href: "/admin/hackathons",
    icon: LuTrophy,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: LuSettings,
  },
];

const managementNavigation = [
  {
    name: "Job Categories",
    href: "/admin/job-categories",
    icon: LuFolders,
  },
  {
    name: "Dial Codes",
    href: "/admin/dial-codes",
    icon: LuPhone,
  },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static h-full flex-col border-r bg-white transition-all duration-300 z-40",
          isOpen ? "flex" : "hidden lg:flex",
          isOpen ? (isMobile ? "w-64" : "w-64") : "w-20"
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b",
            isOpen ? "px-6" : "justify-center px-2"
          )}
        >
          {isOpen ? (
            <span className="text-xl font-bold">Admin Panel</span>
          ) : (
            <span className="text-xl font-bold">AP</span>
          )}

          {/* Toggle Button */}
          <button
            onClick={toggle}
            className="ml-auto lg:flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? (
              <LuX className="h-5 w-5 text-gray-500" />
            ) : (
              <LuMenu className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        <nav className="flex flex-col h-full">
          <div className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    !isOpen && "justify-center"
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isOpen && "mr-3",
                      isActive
                        ? "text-primary-foreground"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {isOpen && item.name}
                </Link>
              );
            })}

            <div className="relative my-4">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              {isOpen && (
                <div className="relative flex justify-start">
                  <span className="bg-white pr-2 text-sm text-gray-500">
                    Management
                  </span>
                </div>
              )}
            </div>

            {managementNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    !isOpen && "justify-center"
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isOpen && "mr-3",
                      isActive
                        ? "text-primary-foreground"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {isOpen && item.name}
                </Link>
              );
            })}
          </div>

          <div className="border-t p-4">
            <button
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                !isOpen ? "w-auto justify-center" : "w-full"
              )}
              onClick={logout}
              title={!isOpen ? "Logout" : undefined}
            >
              <LuLogOut
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isOpen && "mr-3",
                  "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {isOpen && "Logout"}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
