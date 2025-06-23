import { useAuth } from "@/context/AuthContex";
import React, { useEffect, useState } from "react";
import JobCard from "../landing/JobCard";
import publicApi from "@/api/publicApi";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

const Sidebar = () => {
  const { id } = useParams();
  const { jobs, setJobs, selectedJob, setSelectedJob } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [selectedJobLoaded, setSelectedJobLoaded] = useState(false);

  useEffect(() => {
    const fetchSelectedJob = async () => {
      if (!id) {
        setSelectedJobLoaded(true); // no ID, still mark as "done"
        return;
      }

      try {
        const response = await publicApi.get(`/find-job/${id}`);
        if (response.data) {
          setSelectedJob(response.data);
        }
      } catch (error) {
        console.error("Error fetching selected job:", error);
      } finally {
        setSelectedJobLoaded(true); // set to true regardless of success
      }
    };

    fetchSelectedJob();
  }, [id]);

  // Second useEffect — fetch all jobs

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const res = await publicApi.get("/find-all-jobs");

        if (res.data && Array.isArray(res.data)) {
          let latestJobs = res.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6);

          if (selectedJob) {
            const existsInList = latestJobs.find(
              (job) => job.id === selectedJob.id
            );
            if (!existsInList) {
              latestJobs = [selectedJob, ...latestJobs.slice(0, 5)];
            } else {
              latestJobs = latestJobs.filter(
                (job) => job.id !== selectedJob.id
              );
              latestJobs.unshift(selectedJob);
            }
          } else if (latestJobs.length > 0) {
            setSelectedJob(latestJobs[0]);
          }

          setJobs(latestJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const queryParams = new URLSearchParams(window.location.search);
    const hasCategory = queryParams.has("category");

    // ✅ Only fetch default jobs if no category is in URL and no jobs exist
    if (
      !initialized &&
      selectedJobLoaded &&
      !hasCategory &&
      jobs.length === 0
    ) {
      setIsLoading(true); // ✅ only show spinner when really loading
      fetchJobs();
      setInitialized(true);
    }
  }, [initialized, selectedJobLoaded, selectedJob, jobs]);

  if (isLoading) {
    return (
      <div className="w-full max-w-sm p-4 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div
      data-component="Sidebar"
      data-page="ApplyForJobPage"
      className="w-full max-w-sm space-y-4 p-4 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto hide-scrollbar"
    >
      {jobs?.length === 0 ? (
        <div className="text-center text-muted-foreground p-4">
          No jobs found matching your search criteria
        </div>
      ) : (
        jobs?.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSelected={selectedJob?.id === job.id}
          />
        ))
      )}
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
