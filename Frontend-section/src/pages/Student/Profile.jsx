import React, { useEffect, useState } from "react";
import StudentSidebar from "@/components/StudentSidebar";
import StudentNavbar from "@/components/StudentNavbar";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/PaymentModal";
import PaymentHistory from "@/components/PaymentHistory";
import { authAPI, borrowAPI } from "@/services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaExclamationTriangle, FaClock, FaCheckCircle } from "react-icons/fa";
import { useSidebar } from "@/contexts/SidebarContext";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [borrowingStatus, setBorrowingStatus] = useState(null);
  const navigate = useNavigate();
  const { isMobile, mobileSidebarOpen, collapsed } = useSidebar();

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const { data } = await authAPI.getProfile();
        if (isMounted) {
          // Check if there's an updated status in localStorage
          const userData = JSON.parse(localStorage.getItem("user") || "{}");
          if (userData.membershipStatus && userData.membershipStatus !== data.membershipStatus) {
            // Use the updated status from localStorage
            setProfile({ ...data, membershipStatus: userData.membershipStatus });
          } else {
            setProfile(data);
          }
        }
      } catch (err) {
        if (isMounted) setError(err?.response?.data?.message || "Failed to load profile");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    const fetchBorrowingStatus = async () => {
      try {
        const { data } = await borrowAPI.getUserBorrowingStatus();
        if (isMounted) {
          setBorrowingStatus(data);
        }
      } catch (err) {
        // Ignore borrowing status errors, not critical for profile
        console.error('Error fetching borrowing status:', err);
      }
    };

    fetchProfile();
    fetchBorrowingStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-row min-h-screen bg-gray-100 dark:bg-gray-900 overflow-x-hidden">
      <StudentSidebar />
      <main className={`flex-1 transition-all duration-300 ${isMobile ? 'px-1' : 'px-6'} py-3 max-w-full overflow-x-hidden ${
        isMobile && mobileSidebarOpen ? 'transform translate-x-64' : ''
      } ${!isMobile ? (collapsed ? 'ml-16' : 'ml-64') : ''}`}>
        <StudentNavbar />
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold mt-6 mb-4 text-gray-900 dark:text-gray-100`}>My Profile</h1>

        {loading && (
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">Loading...</div>
        )}

        {!loading && error && (
          <div className="p-6 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">{error}</div>
        )}

        {!loading && !error && profile && (
          <div className={`${isMobile ? 'p-3' : 'p-6'} rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4 w-full max-w-full overflow-x-hidden`}>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
              <p className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-gray-900 dark:text-gray-100`}>{profile.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-gray-900 dark:text-gray-100`}>{profile.email}</p>
            </div>
            {profile.membershipStatus && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Membership Status</p>
                <div className="flex items-center gap-2">
                  <span className={`${isMobile ? 'px-2 py-1' : 'px-3 py-1'} rounded-full text-sm font-medium ${
                    profile.membershipStatus === "approved" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : profile.membershipStatus === "pending" || profile.membershipStatus === "waiting_for_approval"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : profile.membershipStatus === "canceled"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}>
                    {profile.membershipStatus === "approved" ? "Active" : 
                     profile.membershipStatus === "pending" ? "Pending" :
                     profile.membershipStatus === "waiting_for_approval" ? "Waiting for Approval" :
                     profile.membershipStatus === "canceled" ? "Inactive" : 
                     profile.membershipStatus}
                  </span>
                </div>
              </div>
            )}

            {/* Subscription Section for Pending Users */}
            {profile.membershipStatus === "pending" && (
              <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border ${
                profile.membershipStatus === "pending" 
                  ? "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20" 
                  : "border-gray-200 dark:border-gray-700"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <FaExclamationTriangle className="text-orange-600 dark:text-orange-400" />
                  <h3 className="text-lg font-medium text-orange-800 dark:text-orange-200">
                    Membership Pending
                  </h3>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-4 break-words">
                  Your membership is currently pending approval. To activate your library membership, 
                  please subscribe to one of our membership plans.
                </p>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full"
                >
                  <FaCreditCard />
                  Subscribe Now
                </button>
              </div>
            )}

            {/* Waiting for Approval Section */}
            {profile.membershipStatus === "waiting_for_approval" && (
              <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20`}>
                <div className="flex items-center gap-2 mb-3">
                  <FaClock className="text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                    Waiting for Approval
                  </h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4 break-words">
                  Your payment proof has been submitted successfully. Your membership is now under review 
                  by our administrators. You will be notified once it's approved.
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  Status: Under Review
                </div>
              </div>
            )}

            {/* Approved Section */}
            {profile.membershipStatus === "approved" && (
              <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20`}>
                <div className="flex items-center gap-2 mb-3">
                  <FaCheckCircle className="text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                    Membership Approved
                  </h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 break-words">
                  Congratulations! Your membership has been approved. You can now borrow books from the library.
                </p>
              </div>
            )}

            {/* Canceled/Rejected Section */}
            {profile.membershipStatus === "canceled" && (
              <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20`}>
                <div className="flex items-center gap-2 mb-3">
                  <FaExclamationTriangle className="text-red-600 dark:text-red-400" />
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                    Membership Canceled
                  </h3>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4 break-words">
                  Your membership application was canceled. You can start the subscription process again.
                </p>
                <button
                  onClick={() => {
                    // Reset status to pending to allow resubmission
                    const userData = JSON.parse(localStorage.getItem("user") || "{}");
                    userData.membershipStatus = "pending";
                    localStorage.setItem("user", JSON.stringify(userData));
                    toast.success("Status reset. You can now subscribe again.");
                    window.location.reload();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full"
                >
                  <FaCreditCard />
                  Try Again
                </button>
              </div>
            )}

            <div className="pt-4 w-full">
              <button
                className={`${isMobile ? 'w-full' : ''} px-4 py-2 rounded text-white ${
                  borrowingStatus && (borrowingStatus.totalBorrowed > 0 || borrowingStatus.totalReserved > 0)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={borrowingStatus && (borrowingStatus.totalBorrowed > 0 || borrowingStatus.totalReserved > 0)}
                onClick={() => {
                  // Check if user has active borrows
                  if (borrowingStatus && (borrowingStatus.totalBorrowed > 0 || borrowingStatus.totalReserved > 0)) {
                    toast.error("Cannot delete account. Please return all borrowed books and cancel reservations first.");
                    return;
                  }

                  toast((t) => {
                    let inputValue = "";
                    return (
                      <div>
                        <p className="mb-2">Type <strong>Delete</strong> to confirm account deletion.</p>
                        <input
                          autoFocus
                          type="text"
                          placeholder="Delete"
                          className="w-full mb-3 px-3 py-2 rounded border border-gray-300 focus:outline-none"
                          onChange={(e) => { inputValue = e.target.value; }}
                        />
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
                            onClick={async () => {
                              if (inputValue !== "Delete") {
                                toast.error("Please type Delete to confirm");
                                return;
                              }
                              try {
                                await authAPI.deleteProfile();
                                toast.dismiss(t.id);
                                toast.success("Account deleted");
                                localStorage.removeItem("token");
                                localStorage.removeItem("user");
                                navigate("/");
                              } catch (err) {
                                const msg = err?.response?.data?.message || "Failed to delete account";
                                toast.error(msg);
                              }
                            }}
                          >
                            Confirm Delete
                          </button>
                          <button
                            className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                            onClick={() => toast.dismiss(t.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    );
                  });
                }}
              >
                Delete Account
              </button>
              {borrowingStatus && (borrowingStatus.totalBorrowed > 0 || borrowingStatus.totalReserved > 0) && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 break-words">
                  You cannot delete your account while you have active borrows or reservations. 
                  Please return all books and cancel reservations first.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Payment History Section */}
        {!loading && !error && (
          <div className="mt-6">
            <PaymentHistory />
          </div>
        )}

        <Footer />
      </main>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />
    </div>
  );
};

export default Profile;


