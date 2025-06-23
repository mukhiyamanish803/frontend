// frontend\employara\src\components\auth\SignupForm.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContex";
import { Toaster, toast } from "sonner";

const SignupForm = () => {
  const { signup, loading, setLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "", // Add this line
    role: "JOBSEEKER",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error("Name fields are required");
      return false;
    }
    if (!formData.email) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!_]).{8,}$/;
    if (!passRegex.test(formData.password)) {
      toast.error(
        "Password must be 8+ chars, include uppercase, lowercase, digit & special char"
      );
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await signup(formData);
      await toast.promise(Promise.resolve(), {
        loading: "Creating your account...",
        success: "Account created successfully! Please log in.",
        error: "Failed to create account",
      });
      setTimeout(() => setRedirect(true), 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <motion.div
        className="flex-1 w-full lg:w-[500px] justify-self-center p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="w-full lg:w-[500px] justify-self-center border-0 shadow-xl bg-white/90 backdrop-blur-xl rounded-2xl">
          <CardHeader className="space-y-4 pb-2">
            <CardTitle className="text-4xl font-bold text-center bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Create an account
            </CardTitle>
            <p className="text-sm text-center text-gray-500">
              Join our community and explore opportunities
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-600">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="relative">
                    <input
                      type="radio"
                      id="jobseeker"
                      name="role"
                      value="JOBSEEKER"
                      checked={formData.role === "JOBSEEKER"}
                      onChange={handleChange}
                      className="peer hidden"
                    />
                    <label
                      htmlFor="jobseeker"
                      className="flex items-center justify-center p-3 text-gray-600 bg-white/50 border border-gray-200 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 peer-checked:border-violet-500 peer-checked:bg-violet-50/50 peer-checked:text-violet-600 transition-all duration-200"
                    >
                      Job Seeker
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="radio"
                      id="recruiter"
                      name="role"
                      value="RECRUITER"
                      checked={formData.role === "RECRUITER"}
                      onChange={handleChange}
                      className="peer hidden"
                    />
                    <label
                      htmlFor="recruiter"
                      className="flex items-center justify-center p-3 text-gray-600 bg-white/50 border border-gray-200 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 peer-checked:border-violet-500 peer-checked:bg-violet-50/50 peer-checked:text-violet-600 transition-all duration-200"
                    >
                      Recruiter
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-600"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-gray-200 bg-white/50 hover:bg-white/80 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-600"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-gray-200 bg-white/50 hover:bg-white/80 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-600"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-xl border-gray-200 bg-white/50 hover:bg-white/80 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-600"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-gray-200 bg-white/50 hover:bg-white/80 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 pr-10 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-violet-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-600"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-gray-200 bg-white/50 hover:bg-white/80 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 pr-10 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-violet-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-violet-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                    />
                    Creating account...
                  </div>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-violet-600 hover:text-violet-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default SignupForm;
