import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, PenSquare, Trash2 } from "lucide-react";
import recruiterApi from "@/api/recruiterApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditJobDialog from "./EditJobDialog"; // Adjust the import path as necessary
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const timeAgo = (date) => {
  if (!date) return "Invalid date";

  // Convert the date string to Date object at midnight UTC
  const givenDate = new Date(date + "T00:00:00Z");

  // Set current date to midnight UTC for fair comparison
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);

  // Check if the date is valid
  if (isNaN(givenDate.getTime())) {
    return "Invalid date";
  }

  // For future dates
  if (givenDate > now) {
    return `Scheduled for ${givenDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`;
  }

  // Calculate days difference
  const diffTime = Math.abs(now - givenDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

const getMostRecentDate = (job) => {
  const dates = [job.createdAt, job.updatedAt, job.closedAt].filter(Boolean);
  return new Date(Math.max(...dates.map((date) => new Date(date))));
};

const getJobStatus = (job) => {
  if (job.status === "CLOSED" && job.closedAt) {
    return `Closed ${timeAgo(job.closedAt)}`;
  }
  if (job.updatedAt) {
    return `Updated ${timeAgo(job.updatedAt)}`;
  }
  return `Posted ${timeAgo(job.createdAt)}`;
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Add fetchJobs function outside useEffect for reusability
  const fetchJobs = async () => {
    try {
      const response = await recruiterApi.get("/find-all-jobs");
      console.log("Fetched jobs:", response.data);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    try {
      await recruiterApi.delete(`/delete-job/${jobId}`);
      // Refresh the jobs list after deletion
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const filteredJobs = jobs
    .filter((job) => {
      if (statusFilter === "ALL") return true;
      return job.status === statusFilter;
    })
    .sort((a, b) => getMostRecentDate(b) - getMostRecentDate(a)); // Add this sorting

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">My Job Postings</h1>
        <Link to="/recruiter/jobs/create">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Add Filter Section */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["ALL", "ACTIVE", "CLOSED"].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className="rounded-full px-8"
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">
            {jobs.length === 0
              ? "You haven't posted any jobs yet."
              : "No jobs found with selected filter."}
          </p>
          {jobs.length === 0 && (
            <Link to="/recruiter/post-job">
              <Button>Post Your First Job</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-200 p-4 sm:p-5 flex flex-col w-full bg-white"
            >
              <div className="flex items-start justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div>
                    <img
                      src={job.companyLogoUrl}
                      alt={`${job.companyName} logo`}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-contain bg-gray-50 p-1 border border-gray-100"
                    />
                  </div>
                  <div>
                    <h2 className="text-gray-900 font-semibold text-sm sm:text-base">
                      {job.companyName}
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {getJobStatus(job)}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border focus:outline-none ${
                        job.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {job.status}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={async () => {
                        if (job.status !== "ACTIVE") {
                          await recruiterApi.patch(
                            `/update-job-status/${job.id}?status=ACTIVE`
                          );
                          fetchJobs();
                        }
                      }}
                    >
                      ACTIVE
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        if (job.status !== "CLOSED") {
                          await recruiterApi.patch(
                            `/update-job-status/${job.id}?status=CLOSED`
                          );
                          fetchJobs();
                        }
                      }}
                    >
                      CLOSED
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-lg sm:text-xl mb-2">
                  {job.jobTitle}
                </h3>
                <p className="text-gray-900 text-base sm:text-lg mb-3">
                  {job.salaryRange}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                    {job.jobType}
                  </span>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                    {job.experienceLevel}
                  </span>
                  <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                    {job.location}
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                  {job.jobDescription}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 sm:p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setSelectedJob(job)}
                  >
                    <PenSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 sm:p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(job.id)}
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedJob && (
        <EditJobDialog
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdate={(updatedJob) => {
            setJobs(jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default Jobs;
