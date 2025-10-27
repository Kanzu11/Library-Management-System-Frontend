import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import books from "@/demo/Bookdata";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { FaBook, FaUser, FaClock } from "react-icons/fa";
import StudentSidebar from "@/components/StudentSidebar";
import StudentNavbar from "@/components/StudentNavbar";
import Footer from "@/components/Footer";
import { borrowAPI, utils } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BookDetail = () => {
  const { id } = useParams();
  const { isDark } = useTheme();
  const { isMobile, mobileSidebarOpen, collapsed } = useSidebar();

  // Find the book by ID
  const book = books.find((b) => b.id === parseInt(id));

  // Borrowing history state
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [borrowHistoryLoading, setBorrowHistoryLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 5
  });

  // Load borrowing history
  const loadBorrowHistory = async (page = 1, limit = 5) => {
    try {
      setBorrowHistoryLoading(true);
      const response = await borrowAPI.getBookBorrowingHistory(id, page, limit);
      setBorrowHistory(response.data.borrowHistory);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Failed to load borrowing history:", err);
      setBorrowHistory([]);
    } finally {
      setBorrowHistoryLoading(false);
    }
  };

  // Load borrowing history when component mounts
  useEffect(() => {
    if (id) {
      loadBorrowHistory(1, 5);
    }
  }, [id]);

  // Handle page change
  const handlePageChange = (newPage) => {
    loadBorrowHistory(newPage, pagination.limit);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newLimit) => {
    loadBorrowHistory(1, newLimit);
  };

  if (!book) {
    return (
      <div className={`p-4 ${isDark ? "text-white" : "text-black"}`}>
        Book not found
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <StudentSidebar />
      <main className={`flex-1 p-6 transition-all duration-300 ${
        isMobile && mobileSidebarOpen ? 'transform translate-x-64' : ''
      } ${!isMobile ? (collapsed ? 'ml-16' : 'ml-64') : ''}`}>
        <StudentNavbar />

        <div
          className={`p-6 ${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-md mb-6`}
        >
          <h1
            className={`text-3xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {book.title}
          </h1>
          <div className="flex items-center mb-4">
            <img
              src={book.image}
              alt={book.title}
              className="w-32 h-48 object-cover rounded-lg shadow-md mr-4"
            />
            <div>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Author: {book.author}
              </p>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Status: {book.status}
              </p>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Total Copies: {book.totalAmount}
              </p>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Borrowed: {book.borrowed}
              </p>
            </div>
          </div>
          <h2
            className={`text-xl font-semibold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Description
          </h2>
          <p
            className={`text-md ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {book.description}
          </p>
        </div>

        {/* Borrowing Activity Section */}
        <Card
          className={`mb-6 ${isDark ? "bg-gray-800 border-gray-700" : ""}`}
        >
          <CardHeader>
            <CardTitle className={isDark ? "text-white" : ""}>
              Recent Borrowing Activity for This Book
            </CardTitle>
            <CardDescription className={isDark ? "text-gray-400" : ""}>
              View borrowing and return activities
            </CardDescription>
          </CardHeader>

          <CardContent>
            {borrowHistoryLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Loading borrowing history...
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className={
                          isDark
                            ? "border-b border-gray-700"
                            : "border-b border-gray-200"
                        }
                      >
                        <th
                          className={`text-left py-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          User
                        </th>
                        <th
                          className={`text-left py-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Status
                        </th>
                        <th
                          className={`text-left py-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Borrow Date
                        </th>
                        <th
                          className={`text-left py-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Due Date
                        </th>
                        <th
                          className={`text-left py-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Return Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowHistory.map((entry, idx) => (
                        <tr
                          key={entry._id || idx}
                          className={
                            isDark
                              ? "border-b border-gray-700"
                              : "border-b border-gray-200"
                          }
                        >
                          <td
                            className={`py-3 ${
                              isDark ? "text-gray-300" : "text-gray-800"
                            }`}
                          >
                            {entry.user?.username || "Unknown User"}
                          </td>
                          <td
                            className={`py-3 ${
                              isDark ? "text-gray-300" : "text-gray-800"
                            }`}
                          >
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${utils.getStatusColor(entry.status)}`}
                            >
                              {utils.getStatusText(entry.status)}
                            </span>
                          </td>
                          <td
                            className={`py-3 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {entry.borrowDate ? utils.formatDate(entry.borrowDate) : "N/A"}
                          </td>
                          <td
                            className={`py-3 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {entry.dueDate ? utils.formatDate(entry.dueDate) : "N/A"}
                          </td>
                          <td
                            className={`py-3 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {entry.returnDate ? utils.formatDate(entry.returnDate) : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {borrowHistory.length === 0 && (
                  <div
                    className={`text-center py-8 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No borrowing history available for this book
                  </div>
                )}

                {/* Pagination Controls */}
                {pagination.totalCount > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className={`flex items-center space-x-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      <span>Rows per page:</span>
                      <select
                        value={pagination.limit}
                        onChange={(e) => handleRowsPerPageChange(parseInt(e.target.value))}
                        className={`px-2 py-1 border rounded ${
                          isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                        }`}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                      </select>
                    </div>

                    <div className={`flex items-center space-x-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      <span>
                        {((pagination.currentPage - 1) * pagination.limit) + 1}–
                        {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount}
                      </span>
                      
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={!pagination.hasPrevPage}
                          className={isDark ? "border-gray-600 text-gray-300" : ""}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={!pagination.hasNextPage}
                          className={isDark ? "border-gray-600 text-gray-300" : ""}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Footer />
      </main>
    </div>
  );
};

export default BookDetail;
