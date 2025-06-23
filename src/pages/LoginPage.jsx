import React from "react";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex max-w-7xl mx-auto gap-2 lg:gap-8 px-4 py-16">
      <div className="w-1/2 flex items-center justify-center max-[960px]:hidden">
        <img
          src="https://res.cloudinary.com/dhopew3ev/image/upload/v1749303703/LoginImage_gt4fdf.svg"
          alt="Login Illustration"
          className=""
        />
      </div>
      <div className="w-1/2 flex items-center justify-center max-[960px]:w-full min-[620px]:px-24">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
