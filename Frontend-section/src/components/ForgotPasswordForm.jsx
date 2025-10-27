import React, { useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { MdEmail, MdArrowBack } from "react-icons/md";
import { authAPI } from "@/services/api";
import toast from "react-hot-toast";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authAPI.forgotPassword(email);
      setIsSubmitted(true);
      toast.success("Password reset email sent successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send reset email. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md bg-white bg-opacity-80 rounded-xl p-8 backdrop-blur-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdEmail className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800">
            <strong>Important:</strong> The reset link will expire in 10 minutes for security reasons.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
            variant="outline"
            className="w-full"
          >
            Try Different Email
          </Button>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <MdArrowBack size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white bg-opacity-80 rounded-xl p-8 backdrop-blur-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          No worries! Enter your email address and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            className="block text-blue-900 font-semibold mb-2"
            htmlFor="email"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
              <MdEmail size={20} />
            </span>
            <input
              className="border text-black border-blue-300 rounded-md px-4 py-3 w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your email address"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="bg-blue-600 text-white py-3 px-4 rounded-md font-bold hover:bg-blue-700 transition w-full"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>

        <div className="text-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <MdArrowBack size={16} />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
