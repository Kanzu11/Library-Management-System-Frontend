import React from "react";
import Login from "./pages/Auth/Login";
import { Route, Router, Routes } from "react-router-dom";
import AdminDashboard from "./pages/Admin/AdminDashboardModern";
import StudentDashboard from "./pages/Student/StudentDashboardEnhanced";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ManageUsers from "./pages/Admin/ManageUsers";
import AddBook from "./pages/Admin/AddBook";
import Orders from "./pages/Admin/Orders";
import ManageBook from "./pages/Admin/ManageBookModern";
import Bookdetail from "./pages/Admin/Bookdetail";
import StudentBookDetail from "./pages/Student/BookDetail";
import BrowseBooks from "./pages/Student/BrowseBooks";
import PrivateRoute from "@/routes/PrivateRoute";
import { Toaster } from "react-hot-toast";
import StudentProfile from "./pages/Student/Profile";
import AdminProfile from "./pages/Admin/AdminProfile";
import { SidebarProvider } from "@/contexts/SidebarContext";

const App = () => {
  return (
    <SidebarProvider>
      <div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute role="admin">
              <ManageUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-book"
          element={
            <PrivateRoute role="admin">
              <AddBook />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <PrivateRoute role="admin">
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <PrivateRoute role="admin">
              <ManageBook />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/book/:id"
          element={
            <PrivateRoute role="admin">
              <Bookdetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <PrivateRoute role="admin">
              <AdminProfile />
            </PrivateRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <PrivateRoute role="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/student/book/:id"
          element={
            <PrivateRoute role="student">
              <StudentBookDetail />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/student/browse-books"
          element={
            <PrivateRoute role="student">
              <BrowseBooks />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <PrivateRoute role="student">
              <StudentProfile />
            </PrivateRoute>
          }
        />
        </Routes>
      </div>
    </SidebarProvider>
  );
};

export default App;
