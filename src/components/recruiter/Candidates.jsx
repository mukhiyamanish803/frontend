import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HiMail } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import recruiterApi from "@/api/recruiterApi";
import ApplicationDetailsDialog from "@/components/recruiter/ApplicationDetailsDialog";

const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await recruiterApi.get("/candidates");
        setCandidates(response.data);
      } catch (error) {
        toast.error("Failed to fetch candidates");
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const roles = [
    "all",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
  ];

  const handleStatusChange = async (candidateId, jobId, newStatus) => {
    try {
      await recruiterApi.post("/update-status", {
        appplicantId: candidateId,
        jobId: jobId,
        status: newStatus,
      });

      // Update local state
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.applicantId === candidateId && candidate.jobId === jobId
            ? { ...candidate, status: newStatus }
            : candidate
        )
      );

      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  const getStatusBadge = (status, candidateId, jobId) => {
    const statusStyles = {
      ACTIVE: "bg-green-100 text-green-800",
      IN_REVIEW: "bg-yellow-100 text-yellow-800",
      SHORTLISTED: "bg-blue-100 text-blue-800",
      INTERVIEW: "bg-purple-100 text-purple-800",
      REJECTED: "bg-red-100 text-red-800",
      HIRED: "bg-green-100 text-green-800",
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`${statusStyles[status]} px-3 py-1 flex items-center gap-2`}
          >
            {status}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.keys(statusStyles).map((statusOption) => (
            <DropdownMenuItem
              key={statusOption}
              onClick={() =>
                handleStatusChange(candidateId, jobId, statusOption)
              }
              className={status === statusOption ? "bg-accent" : ""}
            >
              {statusOption}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Filter candidates based on search and filters
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.applicantFirstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      candidate.applicantLastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filter === "all" || candidate.status.toLowerCase() === filter;
    const matchesRole =
      roleFilter === "all" ||
      candidate.jobTitle.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-7xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Candidates</h1>

      <div className="flex gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="review">In Review</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role.toLowerCase()}>
                {role === "all" ? "All Roles" : role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Applied For</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Application Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading candidates...
                </TableCell>
              </TableRow>
            ) : filteredCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No candidates found
                </TableCell>
              </TableRow>
            ) : (
              filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">
                    {candidate.applicantFirstName} {candidate.applicantLastName}
                  </TableCell>
                  <TableCell>{candidate.jobTitle}</TableCell>
                  <TableCell>{candidate.applicantEmail}</TableCell>
                  <TableCell>
                    <ApplicationDetailsDialog candidate={candidate} />
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(
                      candidate.status,
                      candidate.applicantId,
                      candidate.jobId
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600"
                      >
                        <HiMail className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default Candidates;
