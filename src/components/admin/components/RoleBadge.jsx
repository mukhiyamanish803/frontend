import React from "react";

const RoleBadge = ({ role }) => {
  const getRoleStyles = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700";
      case "RECRUITER":
        return "bg-blue-100 text-blue-700";
      case "JOBSEEKER":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleStyles(
        role
      )}`}
    >
      {role}
    </span>
  );
};

export default RoleBadge;
