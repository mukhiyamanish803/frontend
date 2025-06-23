import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContex";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Application = () => {
  const { appliedJobs, setAppliedJobs, notifications } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "SHORTLISTED":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      case "IN_REVIEW":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "INTERVIEW":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "REJECTED":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "HIRED":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  useEffect(() => {
    if (notifications.length === 0) return;

    const latest = notifications[0];
    const jobId = latest?.message?.jobId;
    const newStatus = latest?.message?.status;

    if (!jobId || !newStatus) return;

    setAppliedJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.jobId === jobId ? { ...job, status: newStatus } : job
      )
    );
  }, [notifications]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredApplications = appliedJobs?.filter((job) => {
    if (statusFilter === "all") return true;
    return job.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="container max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredApplications?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No applications found
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Details</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications?.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <Link
                        to={`/jobs/${application.jobId}`}
                        className="font-medium hover:text-primary"
                      >
                        {application.jobTitle}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{application.companyName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(application.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(application.status)}
                    >
                      {application.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Application;
