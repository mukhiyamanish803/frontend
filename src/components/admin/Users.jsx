import React, { useState, useEffect } from "react";
import adminApi from "@/api/adminApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UserTable from "./components/UserTable";
import UserFilters from "./components/UserFilters";

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage - 1,
          size: ITEMS_PER_PAGE,
          ...(search && { search }),
          ...(roleFilter !== "ALL" && { role: roleFilter }),
          ...(statusFilter !== "ALL" && { status: statusFilter }),
        });

        const response = await adminApi.get(`/users?${params}`);
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, search, roleFilter, statusFilter]);
  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await adminApi.patch(`/users/${userId}/status`, { status: newStatus });
      // Refresh the users list
      const params = new URLSearchParams({
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
        ...(search && { search }),
        ...(roleFilter !== "ALL" && { role: roleFilter }),
        ...(statusFilter !== "ALL" && { status: statusFilter }),
      });
      const response = await adminApi.get(`/users?${params}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      toast.success("User status updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <UserFilters
          search={search}
          onSearch={setSearch}
          roleFilter={roleFilter}
          onRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
        />
      </div>

      <div className="border rounded-lg">
        <UserTable
          users={users}
          loading={loading}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Users;
