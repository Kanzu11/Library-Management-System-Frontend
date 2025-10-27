import AdminSidebar from "@/components/AdminSidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/contexts/SidebarContext";
import React, { useState, useEffect, useMemo } from "react";
import BookCard from "@/components/BookCard";
import { booksAPI } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaSearch, FaFilter, FaSort } from "react-icons/fa";

const ManageBook = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const { isDark } = useTheme();
  const { isMobile, mobileSidebarOpen, collapsed } = useSidebar();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await booksAPI.getAllBooks();
        setBooks(response.data || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    if (!books) return [];

    let filtered = books.filter((book) => {
      const title = (book.title || "").toLowerCase();
      const author = (book.author || "").toLowerCase();
      return (
        title.includes(search.toLowerCase()) ||
        author.includes(search.toLowerCase())
      );
    });

    if (statusFilter !== "all") {
      filtered = filtered.filter((book) => {
        const isAvailable = (Number(book.availableCopies) || 0) > 0;
        return statusFilter === "Available" ? isAvailable : !isAvailable;
      });
    }

    // Sort books
    filtered.sort((a, b) => {
      let aValue, bValue;
      let result = 0;

      switch (sortBy) {
        case "title":
          aValue = (a.title || "").toLowerCase();
          bValue = (b.title || "").toLowerCase();
          result = aValue.localeCompare(bValue);
          break;
        case "author":
          aValue = (a.author || "").toLowerCase();
          bValue = (b.author || "").toLowerCase();
          result = aValue.localeCompare(bValue);
          break;
        case "available":
          aValue = Number(a.availableCopies) || 0;
          bValue = Number(b.availableCopies) || 0;
          result = aValue - bValue;
          break;
        case "borrowed":
          aValue = (Number(a.totalCopies) || 0) - (Number(a.availableCopies) || 0);
          bValue = (Number(b.totalCopies) || 0) - (Number(b.availableCopies) || 0);
          result = aValue - bValue;
          break;
        default:
          aValue = (a.title || "").toLowerCase();
          bValue = (b.title || "").toLowerCase();
          result = aValue.localeCompare(bValue);
      }

      return sortOrder === "asc" ? result : -result;
    });

    return filtered;
  }, [books, search, statusFilter, sortBy, sortOrder]);

  return (
    <div className={`flex flex-row min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <AdminSidebar />
      <main className={`flex-1 transition-all duration-300 ${isMobile ? 'px-2' : 'px-6'} py-3 ${
        isMobile && mobileSidebarOpen ? 'transform translate-x-64' : ''
      } ${!isMobile ? (collapsed ? 'ml-16' : 'ml-64') : ''}`}>
        {!(isMobile && mobileSidebarOpen) && <Navbar />}
        <h1
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-blue-600"
          } mb-8 pt-6 md:pt-8`}
        >
          Manage Books
        </h1>
        {/* Search and Filter Controls */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isDark
                  ? "border-gray-600 bg-gray-800 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="relative flex-1">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  isDark
                    ? "border-gray-600 bg-gray-800 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              >
                <option value="all">All Books</option>
                <option value="Available">Available Only</option>
                <option value="Unavailable">Unavailable Only</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="relative flex-1">
              <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  isDark
                    ? "border-gray-600 bg-gray-800 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              >
                <option value="title">Sort by Title</option>
                <option value="author">Sort by Author</option>
                <option value="available">Sort by Available</option>
                <option value="borrowed">Sort by Borrowed</option>
              </select>
            </div>

            {/* Sort Order Toggle */}
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Order:
              </span>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => <BookCard key={book._id} book={book} />)
          ) : (
            <div
              className={`col-span-full text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No books found.
            </div>
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default ManageBook;
