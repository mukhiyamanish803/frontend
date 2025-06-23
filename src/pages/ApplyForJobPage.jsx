import SearchHeader from "@/components/job/SearchHeader";
import Sidebar from "@/components/job/Sidebar";
import JobDetails from "@/components/job/JobDetails";
import React, { useEffect } from "react";

const ApplyForJobPage = () => {
  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <SearchHeader />
      <div className="flex max-w-7xl mx-auto min-h-screen relative">
        <Sidebar />
        <JobDetails />
      </div>
    </div>
  );
};

export default ApplyForJobPage;
