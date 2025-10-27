import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdLock, MdCheckCircle, MdError } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { authAPI } from "@/services/api";
import toast from "react-hot-toast";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid reset link. Please request a new password reset.");
        setIsValidatingToken(false);
        return;
      }

      try {
        const response = await authAPI.validateResetToken(token);
        if (response.data.valid) {
          setIsValidatingToken(false);
        } else {
          setError("Invalid or expired reset token. Please request a new password reset.");
          setIsValidatingToken(false);
        }
      } catch (err) {
        setError("Invalid or expired reset token. Please request a new password reset.");
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const validateForm = () => {
    const errors = {};

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authAPI.resetPassword(token, password);
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-white bg-opacity-80 rounded-xl p-8 backdrop-blur-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdCheckCircle className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">Password Reset Successfully!</h2>
          <p className="text-gray-600">
            Your password has been updated. You can now log in with your new password.
          </p>
        </div>

        <Button
          onClick={() => navigate("/")}
          className="bg-green-600 text-white py-3 px-6 rounded-md font-bold hover:bg-green-700 transition w-full"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  if (isValidatingToken) {
    return (
      <div className="w-full max-w-md bg-white bg-opacity-80 rounded-xl p-8 backdrop-blur-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Validating Link</h2>
          <p className="text-gray-600">
            Please wait while we validate your reset link...
          </p>
        </div>
      </div>
    );
  }

  if (error && (!token || !isValidatingToken)) {
    return (
      <div className="w-full max-w-md bg-white bg-opacity-80 rounded-xl p-8 backdrop-blur-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdError className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>

        <Link
          to="/forgot-password"
          className="bg-blue-600 text-white py-3 px-6 rounded-md font-bold hover:bg-blue-700 transition inline-block w-full text-center"
        >
          Request New Reset Link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white bg-opacity-80 rounded-xl p-8 backdrop-blur-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Reset Your Password</h2>
        <p className="text-gray-600">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            className="block text-blue-900 font-semibold mb-2"
            htmlFor="password"
          >
            New Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
              <MdLock size={20} />
            </span>
            <input
              className={`border text-black border-blue-300 rounded-md px-4 py-3 w-full pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                validationErrors.password ? "border-red-500" : ""
              }`}
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Enter new password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-400"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
          )}
        </div>

        <div>
          <label
            className="block text-blue-900 font-semibold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
              <MdLock size={20} />
            </span>
            <input
              className={`border text-black border-blue-300 rounded-md px-4 py-3 w-full pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                validationErrors.confirmPassword ? "border-red-500" : ""
              }`}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Confirm new password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-400"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.confirmPassword}</p>
          )}
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
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>

        <div className="text-center">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
