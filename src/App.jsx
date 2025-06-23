import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import "./App.css";
import AuthContex from "./context/AuthContex";
import RootLayout from "./Layout/RootLayout";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./Layout/AdminLayout";
import LandingPage from "./pages/LandingPage";
import Admin_JobCategories from "./components/admin/Admin_JobCategories";
import ProtectedRoute from "./routes/ProtectedRoute";
import JobseekerLayout from "@/Layout/JobseekerLayout";
import JobseekerProfile from "@/components/jobseeker/JobseekerProfile";
import PageNotFound from "./pages/PageNotFound";
import { Toaster } from "sonner";
import DialCode from "./components/admin/DialCode";
import JobseekerEducation from "./components/jobseeker/JobseekerEducation";
import Certificate from "./components/jobseeker/Certificate";
import Experience from "./components/jobseeker/Experience";
import RecruiterLayout from "./Layout/RecruiterLayout";
import CompanyProfile from "@/components/recruiter/CompanyProfile";
import PostJob from "./components/recruiter/PostJob";
import Jobs from "./components/recruiter/Jobs";
import Dashboard from "./components/recruiter/Dashboard";
import Candidates from "./components/recruiter/Candidates";
import ApplyForJobPage from "./pages/ApplyForJobPage";
import SavedJobs from "./components/jobseeker/SavedJobs";
import Application from "./components/jobseeker/Application";
import Projects from "./components/jobseeker/Projects";
import AdminDashboard from "./components/admin/AdminDashboard";
import RegisteredCompanies from "./components/admin/RegisteredCompanies";
import Users from "./components/admin/Users";
import Internship from "./components/recruiter/Internship";
import Hackathons from "./pages/Hackathons";
import Recruiter_Hackathons from "./components/recruiter/Recruiter_Hackathons";

function App() {
  return (
    <AuthContex>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          {/* Public routes with header/footer */}
          <Route element={<RootLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="jobs" element={<ApplyForJobPage />} />
            <Route path="jobs/:id/apply" element={<ApplyForJobPage />} />
            <Route path="internship" element={<ApplyForJobPage />} />
            <Route path="hackathons" element={<Hackathons />} />
          </Route>

          {/* Protected Jobseeker routes */}
          <Route
            path="/jobseeker/*"
            element={
              <ProtectedRoute allowedRoles={["JOBSEEKER"]}>
                <JobseekerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="profile" element={<JobseekerProfile />} />
            <Route path="education" element={<JobseekerEducation />} />
            <Route path="certifications" element={<Certificate />} />
            <Route path="experience" element={<Experience />} />
            <Route path="projects" element={<Projects />} />
            <Route path="saved-jobs" element={<SavedJobs />} />
            <Route path="applications" element={<Application />} />
          </Route>

          {/* Protected Recruiter routes */}
          <Route
            path="/recruiter/*"
            element={
              <ProtectedRoute allowedRoles={["RECRUITER"]}>
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="company/profile" element={<CompanyProfile />} />
            <Route path="internships" element={<Internship />} />
            <Route path="hackathons" element={<Recruiter_Hackathons />} />
            <Route path="jobs">
              <Route index element={<Jobs />} />
              <Route path="create" element={<PostJob />} />
              <Route path=":id" element={<h1>Job Details</h1>} />
              <Route path=":id/edit" element={<PostJob />} />
              <Route path="applications" element={<h1>Job Applications</h1>} />
            </Route>
          </Route>

          {/* Protected Admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="job-categories" element={<Admin_JobCategories />} />
            <Route path="companies" element={<RegisteredCompanies />} />
            <Route path="dial-codes" element={<DialCode />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContex>
  );
}

export default App;
