import React from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContex";
import { toast } from "sonner";

const LoginForm = () => {
  const { loading, setLoading, login, fetchUser } = useAuth();

  const [redirect, setRedirect] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const validateForm = () => {
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
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await login(formData);
      // Show toast and wait for it to be displayed
      await new Promise((resolve) => {
        toast.success("Login successful", {
          onAutoClose: resolve,
          duration: 1500,
        });
      });

      await fetchUser();
      setLoading(false);
      setRedirect(true);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      setLoading(false);
    }
  };
  if (redirect) {
    return <Navigate to="/" replace />;
  }
  return (
    <motion.div
      className="flex-1 w-full lg:w-[450px] justify-self-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-0 shadow-xl backdrop-blur-xl rounded-2xl bg-transparent">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome back
          </CardTitle>
          <p className="text-gray-500 text-base">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
                className="h-12 rounded-md border-none transition-all duration-200"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                className="h-12 rounded-md border-none transition-all duration-200"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer flex items-center">
                <input
                  type="checkbox"
                  className="rounded mr-2 text-violet-600 focus:ring-violet-500"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-violet-600 hover:text-violet-500 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-violet-200"
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
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-500">
                  New to Employara?
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-200 hover:border-violet-500 hover:bg-violet-50/50 text-gray-700 hover:text-violet-700 transition-all duration-200"
              asChild
            >
              <Link to="/signup">Create an account</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
      <style>
        {`
        input:focus{
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
          outline: none;
        }

        `}
      </style>
    </motion.div>
  );
};

export default LoginForm;
