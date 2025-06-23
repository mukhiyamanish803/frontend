import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FiBriefcase, FiUsers, FiCalendar, FiTrendingUp } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import recruiterApi from "@/api/recruiterApi";
import { useAuth } from "@/context/AuthContex";

const Dashboard = () => {
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([
    {
      title: "Total Jobs",
      count: 0,
      icon: FiBriefcase,
      color: "text-blue-600",
    },
    {
      title: "Active Candidates",
      count: 0,
      icon: FiUsers,
      color: "text-green-600",
    },
    {
      title: "Interviews",
      count: 0,
      icon: FiCalendar,
      color: "text-orange-600",
    },
    { title: "Hired", count: 0, icon: FiTrendingUp, color: "text-purple-600" },
  ]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [hiringProgress, setHiringProgress] = useState({
    applicationsReview: 0,
    interviews: 0,
    offersSent: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [statsData, jobsData, progressData] = await Promise.all([
          recruiterApi.getDashboardStats(),
          recruiterApi.getRecentJobs(),
          recruiterApi.getHiringProgress(),
        ]);

        // Update stats counts
        setStats((prevStats) =>
          prevStats.map((stat) => ({
            ...stat,
            count: statsData[stat.title.toLowerCase().replace(" ", "_")] || 0,
          }))
        );

        setRecentJobs(jobsData);
        setHiringProgress(progressData);
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-0 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-2">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              Welcome back, Recruiter!
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Here’s an overview of your hiring activity.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card
                  key={stat.title}
                  className="p-6 rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border-0 hover:scale-[1.03] transition-transform duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-md ${stat.color} group-hover:scale-110 transition-transform`}
                    >
                      <stat.icon size={32} />
                    </div>
                    <div>
                      <h3 className="text-4xl font-extrabold text-gray-900">
                        {stat.count}
                      </h3>
                      <p className="text-base text-gray-500 font-medium">
                        {stat.title}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid gap-8 md:grid-cols-7">
              <Card className="col-span-4 p-0 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border-0">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">
                    Recent Job Postings
                  </h3>
                  <div className="overflow-x-auto rounded-xl">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-blue-100 to-purple-100">
                          <TableHead className="font-bold text-gray-700">
                            Position
                          </TableHead>
                          <TableHead className="font-bold text-gray-700">
                            Applicants
                          </TableHead>
                          <TableHead className="font-bold text-gray-700">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentJobs.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-center text-gray-400 py-8"
                            >
                              No recent jobs found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          recentJobs.map((job, idx) => (
                            <TableRow
                              key={job.title}
                              className={
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <TableCell className="font-medium text-gray-900">
                                {job.title}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {job.applicants}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                                    job.status === "Active"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-200 text-gray-600"
                                  }`}
                                >
                                  {job.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Card>

              <Card className="col-span-3 p-0 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border-0 flex flex-col justify-between">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">
                    Hiring Progress
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Applications Review
                        </span>
                        <span className="text-sm font-bold text-blue-700">
                          {hiringProgress.applicationsReview}%
                        </span>
                      </div>
                      <Progress
                        value={hiringProgress.applicationsReview}
                        className="h-3 rounded-full bg-blue-100"
                        indicatorClassName="bg-gradient-to-r from-blue-400 to-blue-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Interviews
                        </span>
                        <span className="text-sm font-bold text-orange-700">
                          {hiringProgress.interviews}%
                        </span>
                      </div>
                      <Progress
                        value={hiringProgress.interviews}
                        className="h-3 rounded-full bg-orange-100"
                        indicatorClassName="bg-gradient-to-r from-orange-400 to-orange-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Offers Sent
                        </span>
                        <span className="text-sm font-bold text-purple-700">
                          {hiringProgress.offersSent}%
                        </span>
                      </div>
                      <Progress
                        value={hiringProgress.offersSent}
                        className="h-3 rounded-full bg-purple-100"
                        indicatorClassName="bg-gradient-to-r from-purple-400 to-purple-600"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
