import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function PremiumNav({ compact = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser && storedUser.id) setUser(storedUser);
      } catch (e) {
        console.error("Failed to parse user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${compact ? "bg-white shadow-sm border-b border-slate-100 py-3" : scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-100 py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-[90rem] mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 group-hover:shadow-indigo-300 transition-all duration-300">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
            Job<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Board</span>
          </span>
        </Link>

        {/* Middle: Links - Hide in compact mode */}
        {!compact && (
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-bold transition-all ${isActive("/") ? "text-indigo-600" : scrolled ? "text-slate-600 hover:text-indigo-600" : "text-slate-200 hover:text-white"}`}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className={`text-sm font-bold transition-all ${isActive("/jobs") ? "text-indigo-600" : scrolled ? "text-slate-600 hover:text-indigo-600" : "text-slate-200 hover:text-white"}`}
            >
              Discover Jobs
            </Link>
            {user?.role === "employer" && (
              <>
                <Link
                  to="/post-job"
                  className={`text-sm font-bold transition-all ${isActive("/post-job") ? "text-indigo-600" : scrolled ? "text-slate-600 hover:text-indigo-600" : "text-slate-200 hover:text-white"}`}
                >
                  Post a Job
                </Link>
                <Link
                  to="/employer-dashboard"
                  className={`text-sm font-bold transition-all ${isActive("/employer-dashboard") ? "text-indigo-600" : scrolled ? "text-slate-600 hover:text-indigo-600" : "text-slate-200 hover:text-white"}`}
                >
                  Dashboard
                </Link>
              </>
            )}
            {user?.role === "candidate" && (
              <Link
                to="/candidate-dashboard"
                className={`text-sm font-bold transition-all ${isActive("/candidate-dashboard") ? "text-indigo-600" : scrolled ? "text-slate-600 hover:text-indigo-600" : "text-slate-200 hover:text-white"}`}
              >
                My Profile
              </Link>
            )}
          </div>
        )}

        {/* Right Side: Auth / Profile */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100 hover:border-indigo-100 hover:shadow-md">
                Sign In
              </Link>
              <Link to="/register" className="text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-6 py-2.5 rounded-full shadow-lg shadow-indigo-200 transition-all hover:scale-105 hover:shadow-indigo-300">
                Register Free
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-3 bg-white border border-slate-100 rounded-full p-1.5 shadow-sm hover:shadow-md transition-all pr-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'User'}&backgroundColor=e0e7ff&textColor=4f46e5`} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col max-w-[100px] sm:max-w-[150px]">
                <span className="text-xs font-bold text-slate-800 truncate leading-tight mt-0.5">{user.name}</span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-500 truncate">{user.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-2 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                title="Sign Out"
              >
                <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

export default PremiumNav;
