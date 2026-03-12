import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [isSticky, setSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Check if we are on the homepage
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    // Optional: clear local storage if managed manually outside context
  };

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/#doctorContaints" }, // Anchor link
    { name: "CONTACT", path: "/#ContactPage" },
    { name: "BLOG", path: "/#BlogContaint" },
    { name: "DENTAL SERVICE", path: "/#serviceContaint" },
    { name: "REVIEWS", path: "/#reviewsContaints" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isSticky || !isHomePage
          ? "bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-white/10 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white">
              Dental Doctor
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-cyan-400 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`text-sm font-medium hover:text-cyan-400 transition-colors ${isSticky ? "text-gray-300" : "text-white"}`}
              >
                {link.name}
              </a>
            ))}

            {user?.email ? (
              <div className="relative group">
                <button
                  className="flex items-center gap-2 group focus:outline-none"
                  title={user.name}
                >
                  <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold border-2 border-transparent group-hover:border-white transition-all">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "U"}
                  </div>
                  {/* Name hidden, shown in dropdown/tooltip */}
                </button>
                <div className="absolute right-0 top-full pt-2 w-48 z-50 hidden group-hover:block">
                  <div className="bg-white rounded-md shadow-lg py-1 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {user.role || "Patient"}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-cyan-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className={`text-sm font-medium hover:text-cyan-400 ${isSticky ? "text-gray-300" : "text-white"}`}
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-white/10 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {user?.email ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
