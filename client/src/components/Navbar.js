import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleProtectedNav = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      
      {/* LEFT SIDE */}
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          JobBoard
        </Link>

        <button
          onClick={() => handleProtectedNav("/jobs")}
          className="hover:text-indigo-600 transition"
        >
          Browse Jobs
        </button>

        {user?.role === "employer" && (
          <button
            onClick={() => navigate("/post-job")}
            className="hover:text-indigo-600 transition"
          >
            Post Job
          </button>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="space-x-6 flex items-center">
        {!user ? (
          <>
            <Link to="/login" className="hover:text-indigo-600">
              Login
            </Link>
            <Link to="/register" className="hover:text-indigo-600">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm">
              {user.role}
            </span>

            {user.role === "candidate" && (
              <button
                onClick={() => navigate("/candidate-dashboard")}
                className="hover:text-indigo-600"
              >
                My Applications
              </button>
            )}

            {user.role === "employer" && (
              <button
                onClick={() => navigate("/employer-dashboard")}
                className="hover:text-indigo-600"
              >
                Dashboard
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
