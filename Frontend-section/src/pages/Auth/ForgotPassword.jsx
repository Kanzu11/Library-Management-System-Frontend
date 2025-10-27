import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import React from "react";
import logo from "@/assets/logo.jpg";

const ForgotPassword = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center rounded-xl shadow-2xl p-8 md:p-5 bg-white max-w-md w-full">
        <img src={logo} alt="Logo" className="h-12 mb-4 rounded" />
        <h2 className="text-3xl font-bold text-blue-900 mb-1" style={{ fontFamily: "Orbitron" }}>ASTUMSJ LIBRARY</h2>
        <h6 className="text-gray-800 mb-1">Password Recovery</h6>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
