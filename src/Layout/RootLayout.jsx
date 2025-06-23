import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
    <div className=
            "bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50 rounded-lg overflow-hidden transition-all cursor-pointer border border-gray-100 fixed min-h-screen min-w-screen h-full -z-10" />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
