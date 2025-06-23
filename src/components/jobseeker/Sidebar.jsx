import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiProfileLine,
  RiFileList3Line,
  RiBookmarkLine,
  RiSettingsLine,
  RiGraduationCapLine,
  RiMedalLine,
  RiHome2Line,
  RiBriefcaseLine,
  RiLogoutBoxLine,
  RiFileCodeLine,
} from "react-icons/ri";
import { useAuth } from "@/context/AuthContex";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0">
      {/* Add Brand/Logo section */}
      <div className="p-4 border-b">
        <Link
          to="/"
          className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <RiHome2Line className="text-xl text-blue-600" />
          <span className="font-semibold text-blue-600">Employara</span>
        </Link>
      </div>

      <div className="py-8">
        <nav className="space-y-4">
          <Link
            to="/jobseeker/profile"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-200 ${
              isActive("/jobseeker/profile")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            <RiProfileLine
              className={`text-xl ${
                isActive("/jobseeker/profile") ? "text-blue-600" : ""
              }`}
            />
            <span>Profile</span>
          </Link>
          <Link
            to="/jobseeker/education"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-200 ${
              isActive("/jobseeker/education")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            <RiGraduationCapLine
              className={`text-xl ${
                isActive("/jobseeker/education") ? "text-blue-600" : ""
              }`}
            />
            <span>Education</span>
          </Link>
          <Link
            to="/jobseeker/certifications"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-200 ${
              isActive("/jobseeker/certifications")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            <RiMedalLine
              className={`text-xl ${
                isActive("/jobseeker/certifications") ? "text-blue-600" : ""
              }`}
            />
            <span>Certifications</span>
          </Link>{" "}
          <Link
            to="/jobseeker/experience"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-200 ${
              isActive("/jobseeker/experience")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            <RiBriefcaseLine
              className={`text-xl ${
                isActive("/jobseeker/experience") ? "text-blue-600" : ""
              }`}
            />
            <span>Experience</span>
          </Link>
          <Link
            to="/jobseeker/projects"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-200 ${
              isActive("/jobseeker/projects")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            <RiFileCodeLine
              className={`text-xl ${
                isActive("/jobseeker/projects") ? "text-blue-600" : ""
              }`}
            />
            <span>Projects</span>
          </Link>
          <Link
            to="/jobseeker/applications"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-200 ${
              isActive("/jobseeker/applications")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            <RiFileList3Line
              className={`text-xl ${
                isActive("/jobseeker/applications") ? "text-blue-600" : ""
              }`}
            />
            <span>Applications</span>
          </Link>
          <Link
            to="/jobseeker/saved-jobs"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-200 ${
              isActive("/jobseeker/saved-jobs")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            <RiBookmarkLine
              className={`text-xl ${
                isActive("/jobseeker/saved-jobs") ? "text-blue-600" : ""
              }`}
            />
            <span>Saved Jobs</span>
          </Link>
          <Link
            to="/jobseeker/settings"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-200 ${
              isActive("/jobseeker/settings")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            <RiSettingsLine
              className={`text-xl ${
                isActive("/jobseeker/settings") ? "text-blue-600" : ""
              }`}
            />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 p-3 w-full rounded transition-all duration-200 hover:bg-red-50 text-red-600"
        >
          <RiLogoutBoxLine className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
