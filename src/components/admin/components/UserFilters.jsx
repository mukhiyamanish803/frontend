import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiSearch } from "react-icons/fi";

const UserFilters = ({
  search,
  onSearch,
  roleFilter,
  onRoleFilter,
  statusFilter,
  onStatusFilter,
}) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <Select value={roleFilter} onValueChange={onRoleFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          {" "}
          <SelectItem value="ALL">All Roles</SelectItem>
          <SelectItem value="JOBSEEKER">Jobseeker</SelectItem>
          <SelectItem value="RECRUITER">Recruiter</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {" "}
          <SelectItem value="ALL">All Status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="BLOCKED">Blocked</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserFilters;
