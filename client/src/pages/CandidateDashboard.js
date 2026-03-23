import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import PremiumNav from "../components/PremiumNav";

function CandidateDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/my");
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "accepted") return "text-emerald-500 bg-emerald-50";
    if (s === "rejected") return "text-rose-500 bg-rose-50";
    return "text-indigo-500 bg-indigo-50";
  };

  return (
    <>
      <PremiumNav compact={true} />
      <div className="min-h-screen bg-[#F4F7FE] font-sans pt-12 pb-10">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-[280px] flex-shrink-0">
          <div className="bg-white rounded-[2rem] shadow-sm p-8 flex flex-col items-center border border-slate-100">
            {/* Profile Pic */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-xl">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name || 'jamet'}`} alt="avatar" className="w-full h-full object-cover bg-indigo-50" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-800 text-center">{user.name || "Jamet Sukoco"}</h2>
            <p className="text-[11px] text-slate-400 mt-2 text-center uppercase tracking-wider font-semibold">Jakarta Selatan, DKI Jakarta<br/>INDONESIA</p>
            
            <div className="w-full h-px bg-slate-100 my-6"></div>

            {/* Menu */}
            <div className="w-full space-y-2">
              <button className="w-full flex items-center space-x-3 text-indigo-600 bg-indigo-50 font-bold px-4 py-3.5 rounded-2xl transition-all shadow-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                <span>Dashboard</span>
              </button>
              <div className="w-full flex items-center justify-between text-slate-500 font-semibold px-4 py-3.5 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all cursor-pointer">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  <span>Applied Jobs</span>
                </div>
              </div>
              <Link to="/jobs" className="w-full flex items-center space-x-3 text-slate-500 font-semibold px-4 py-3.5 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>Browse New Jobs</span>
              </Link>
              
              <button onClick={handleLogout} className="w-full flex items-center space-x-3 text-slate-500 font-semibold px-4 py-3.5 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-colors mt-4">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-6">
          
          {/* Top 3 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl p-6 text-white shadow-sm flex items-start justify-between h-28 relative overflow-hidden">
              <span className="font-semibold text-emerald-50 text-sm">Jobs Applied</span>
              <span className="text-4xl font-black">{applications.length}</span>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-300 opacity-50 rounded-full"></div>
            </div>
          </div>


          <div className="flex flex-col gap-6">
            {/* Recent Activity Mini */}
            <div className="bg-white rounded-[2rem] shadow-sm p-6 border border-slate-100 relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Newest &rsaquo;</span>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-6"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div></div>
              ) : applications.length === 0 ? (
                <div className="text-center bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-500 text-sm">No applications yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id} className="flex items-start justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-sm"></div>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{app.job.company}</p>
                          <h4 className="font-bold text-slate-800 text-sm hover:text-indigo-600 cursor-pointer">{app.job.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">{app.job.location} • Full Time</p>
                          <p className="text-[10px] text-slate-300 mt-2 font-bold uppercase">Applied {new Date(app.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${getStatusColor(app.status)}`}>
                        {app.status === 'pending' ? 'Applied' : app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}

export default CandidateDashboard;
