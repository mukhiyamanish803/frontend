import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Users,
  Briefcase,
  LayoutGrid,
  CheckCircle2,
  Plus,
  Settings,
  RefreshCw,
} from "lucide-react";
import adminApi from "@/api/adminApi";
import publicApi from "@/api/publicApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalCategories: 0,
    activeJobs: 0,
  });
  const [categoryStats, setCategoryStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch categories with job counts
      const categoriesResponse = await publicApi.get("/categories");
      const categories = categoriesResponse.data;
      setCategoryStats(
        categories.map((cat) => ({
          name: cat.category,
          jobs: cat.jobCount || 0,
        }))
      );

      // Fetch other metrics
      const [usersResponse, jobsResponse] = await Promise.all([
        adminApi.get("/users/count"),
        adminApi.get("/jobs/count"),
      ]);

      setMetrics({
        totalUsers: usersResponse.data.total || 0,
        totalJobs: jobsResponse.data.total || 0,
        totalCategories: categories.length,
        activeJobs: jobsResponse.data.active || 0,
      });
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const navigateTo = (path) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Your admin dashboard overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCategories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeJobs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigateTo("/admin/categories")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigateTo("/admin/companies")}
        >
          <Briefcase className="mr-2 h-4 w-4" />
          Manage Companies
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={fetchDashboardData}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigateTo("/admin/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Category Stats Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={0}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jobs" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  API Status
                </p>
                <p className="text-lg font-semibold text-green-500">
                  Operational
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </p>
                <p className="text-lg font-semibold">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
