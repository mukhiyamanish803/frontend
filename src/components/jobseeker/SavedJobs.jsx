import React, { useState, useEffect } from "react";
import jobseekerApi from "@/api/JobseekerApi";
import { cn } from "@/lib/utils";
import { Briefcase, Calendar, Bookmark, Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContex";
import Sidebar from "../job/Sidebar";

const SavedJobs = () => {
  const { setSelectedJob, appliedJobs } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobToUnsave, setJobToUnsave] = useState(null);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await jobseekerApi.get("/saved-jobs");
      setSavedJobs(response.data);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-50";
      case "CLOSED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleUnsaveConfirm = async () => {
    if (!jobToUnsave) return;

    try {
      await jobseekerApi.post(`/save-job/${jobToUnsave}`);
      setSavedJobs((prev) => prev.filter((job) => job.id !== jobToUnsave));
      toast.success("Job removed from saved list");
    } catch (error) {
      toast.error("Failed to remove job from saved list");
    } finally {
      setJobToUnsave(null);
    }
  };

  // Add check for applied status
  const isJobApplied = (jobId) => {
    return appliedJobs?.some((appliedJob) => appliedJob.jobId === jobId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading saved jobs...
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Saved Jobs</h2>
      <div className="space-y-4">
        {savedJobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No saved jobs found
          </div>
        ) : (
          savedJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6 border"
            >
              {/* Company and Job info section */}
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg border flex items-center justify-center p-2">
                    <img
                      src={job.companyLogoUrl}
                      alt={job.companyName}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <Link
                      to={`/jobs/${job.id}/apply`}
                      className="text-lg font-semibold hover:text-primary"
                    >
                      {job.jobTitle}
                    </Link>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{job.companyName}</span>
                    </div>
                  </div>
                </div>

                {/* Status, Apply, and Bookmark in same row */}
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      getStatusColor(job.status)
                    )}
                  >
                    {job.status}
                  </span>
                  {isJobApplied(job.id) ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-2 bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700"
                      disabled
                    >
                      <Check className="h-4 w-4" />
                      Applied
                    </Button>
                  ) : (
                    <Button
                      variant={
                        job.status === "CLOSED" ? "secondary" : "default"
                      }
                      disabled={job.status === "CLOSED"}
                      size="sm"
                      asChild
                    >
                      <Link to={`/jobs/${job.id}/apply`}>
                        {job.status === "CLOSED" ? "Job Closed" : "Apply Now"}
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setJobToUnsave(job.id)}
                    className="text-primary"
                  >
                    <Bookmark className="h-5 w-5 fill-current" />
                  </Button>
                </div>
              </div>

              {/* Job Details section */}
              <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {formatDate(job.deadline)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.appliedCount} applications</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AlertDialog
        open={!!jobToUnsave}
        onOpenChange={() => setJobToUnsave(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsave Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this job from your saved list?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnsaveConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SavedJobs;
