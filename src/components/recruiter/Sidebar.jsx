import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiHomeSmileFill } from "react-icons/ri";
import {
  HiUserGroup,
  HiBriefcase,
  HiChat,
  HiCog,
  HiMenu,
  HiX,
  HiOfficeBuilding,
  HiLogout,
  HiAcademicCap,
  HiLightningBolt,
} from "react-icons/hi";
import { useAuth } from "@/context/AuthContex";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    {
      section: "Main",
      items: [
        {
          path: "/recruiter/dashboard",
          name: "Dashboard",
          icon: <RiHomeSmileFill />,
        },
        {
          path: "/recruiter/candidates",
          name: "Candidates",
          icon: <HiUserGroup />,
        },
        { path: "/recruiter/jobs", name: "Jobs", icon: <HiBriefcase /> },
        {
          path: "/recruiter/internships",
          name: "Internships",
          icon: <HiAcademicCap />,
        },
        {
          path: "/recruiter/hackathons",
          name: "Hackathons",
          icon: <HiLightningBolt />,
        },
        {
          path: "/recruiter/jobs/create",
          name: "Post Job",
          icon: <HiBriefcase />,
        },
      ],
    },
    {
      section: "Company",
      items: [
        {
          path: "/recruiter/company/profile",
          name: "Company Profile",
          icon: <HiOfficeBuilding />,
        },
      ],
    },
    {
      section: "Other",
      items: [
        { path: "/recruiter/messages", name: "Messages", icon: <HiChat /> },
        { path: "/recruiter/settings", name: "Settings", icon: <HiCog /> },
      ],
    },
  ];

  const logoutItem = {
    path: "#",
    name: "Logout",
    icon: <HiLogout />,
    isLogout: true,
  };

  return (
    <div
      className={`backdrop-blur-lg bg-white/70 border-r border-gray-200  overflow-y-auto flex-shrink-0 shadow-xl transition-all duration-300 hide-scrollbar
        ${isCollapsed ? "w-20" : "w-72"} rounded-xl m-2 flex flex-col`}
    >
      <div className="sticky top-0 z-20 bg-white/60 rounded-t-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2">
              <RiHomeSmileFill className="w-9 h-9 text-blue-600 drop-shadow" />
              <span className="text-2xl font-extrabold tracking-tight text-blue-600 drop-shadow">
                EMPLOYARA
              </span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full shadow-md bg-white/80 hover:bg-blue-100 transition-all border border-gray-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <HiMenu size={24} /> : <HiX size={24} />}
          </button>
        </div>
      </div>

      <nav className="p-4 flex-1">
        {navItems.map((section, index) => (
          <div key={index} className="mb-7">
            {!isCollapsed && (
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2">
                {section.section}
              </h2>
            )}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg gap-3 font-medium transition-all
                    ${
                      location.pathname === item.path
                        ? "bg-blue-500/90 text-white shadow-lg border border-blue-400"
                        : "hover:bg-blue-50 hover:text-blue-700 text-gray-700 border border-transparent"
                    }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout button at the bottom */}
      <div className="p-4 mt-auto">
        <button
          onClick={logout}
          className={`flex items-center w-full px-3 py-3 rounded-lg transition-all
            bg-gradient-to-r from-red-50 to-white hover:from-red-100 hover:to-white
            text-red-500 font-semibold gap-3 shadow-sm border border-transparent hover:border-red-200`}
        >
          <span className="text-xl">{logoutItem.icon}</span>
          {!isCollapsed && <span>{logoutItem.name}</span>}
        </button>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
