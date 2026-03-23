import { Link, useNavigate } from "react-router-dom";

function CandidateSidebar({ activeTab = "dashboard" }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-full md:w-[280px] flex-shrink-0">
      <div className="bg-white rounded-[2rem] shadow-sm p-8 flex flex-col items-center border border-slate-100 sticky top-[90px]">
        {/* Profile Pic */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-xl">
            <img 
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name || 'jamet'}`} 
              alt="avatar" 
              className="w-full h-full object-cover bg-indigo-50" 
            />
          </div>
        </div>
        <h2 className="text-lg font-bold text-slate-800 text-center">{user.name || "Candidate"}</h2>
        <p className="text-[11px] text-slate-400 mt-2 text-center uppercase tracking-wider font-semibold">
          {user.role} Account
        </p>
        
        <div className="w-full h-px bg-slate-100 my-6"></div>

        {/* Menu */}
        <div className="w-full space-y-2">
          <Link 
            to="/candidate-dashboard"
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${
              activeTab === "dashboard" 
                ? "text-indigo-600 bg-indigo-50 font-bold shadow-sm" 
                : "text-slate-500 font-semibold hover:bg-slate-50 hover:text-indigo-600"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link 
            to="/candidate-dashboard"
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${
              activeTab === "applied" 
                ? "text-indigo-600 bg-indigo-50 font-bold shadow-sm" 
                : "text-slate-500 font-semibold hover:bg-slate-50 hover:text-indigo-600"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span>Applied Jobs</span>
          </Link>

          <Link 
            to="/jobs" 
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${
              activeTab === "browse" 
                ? "text-indigo-600 bg-indigo-50 font-bold shadow-sm" 
                : "text-slate-500 font-semibold hover:bg-slate-50 hover:text-indigo-600"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>Browse New Jobs</span>
          </Link>
          
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center space-x-3 text-slate-500 font-semibold px-4 py-3.5 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-colors mt-4"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateSidebar;
