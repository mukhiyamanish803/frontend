import React, { useState } from "react";
import {
  Bookmark,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContex";
import { Link } from "react-router-dom";
import jobseekerApi from "@/api/JobseekerApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job, isSelected }) => {
  const { appliedJobs, setSelectedJob } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // Add check for applied status
  const isApplied = appliedJobs?.some(
    (appliedJob) => appliedJob.jobId === job.id
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSaveJob = async (jobId) => {
    try {
      const response = await jobseekerApi.post(`/save-job/${jobId}`);
      if (response.status === 200) {
        const isAlreadySaved = response.data.message.includes("removed");
        setIsSaved(!isAlreadySaved);
        toast.success(response.data.message, {
          duration: 3000, // Auto dismiss after 3 seconds
        });
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job");
    }
  };

  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
        setSelectedJob(job);
        navigate(`/jobs/${job.id}/apply`); // updates URL without page refresh
      }}
      className={cn(
        "bg-gradient-to-br from-purple-50 via-sky-50 to-teal-50 rounded-lg overflow-hidden transition-all cursor-pointer border border-gray-100",
        isSelected ? "shadow-md shadow-blue-200" : "shadow-sm hover:shadow-md"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      {/* Job Header with Company Logo */}
      <div className="relative p-6 pb-4">
        <button
          className="absolute right-4 top-4"
          onClick={(e) => {
            e.stopPropagation();
            handleSaveJob(job.id);
          }}
        >
          <Bookmark
            className={cn(
              "h-5 w-5 transition-colors",
              isSaved
                ? "fill-primary text-primary"
                : "text-gray-400 hover:text-primary"
            )}
          />
        </button>
        <div className="flex gap-4 items-start">
          <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
            <img
              src={job.companyLogoUrl || "https://placehold.co/48"}
              alt={`${job.companyName} logo`}
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">
                <Link to={`/jobs/${job.id}`} className="hover:text-primary">
                  {job.jobTitle}
                </Link>
              </h3>
              <ul className="items-center gap-4 max-[1234px]:flex-col max-[1234px]:items-start max-[1234px]:gap-0">
                <li>
                  <Link
                    to={`${job.website}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {job.companyName}
                  </Link>
                </li>

                <li className="flex gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Deadline:</span>
                  <span>{formatDate(job.deadline)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="px-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>{job.salaryRange}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>{job.experienceLevel} Level</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between py-4 border-t">
          <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize">
            {job.jobType}
          </span>
          {isApplied ? (
            <Button
              variant="secondary"
              size="sm"
              className="gap-2 flex items-center bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700"
              disabled
            >
              <Check className="h-4 w-4" />
              Applied
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedJob(job);
                navigate(`/jobs/${job.id}/apply`);
              }}
              asChild
            >
              <Link to={`/jobs/${job.id}/apply`}>
                <Briefcase className="h-4 w-4" />
                Apply Now
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
