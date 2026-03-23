import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import PremiumNav from "../components/PremiumNav";
import CandidateSidebar from "../components/CandidateSidebar";

function CandidateDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <CandidateSidebar activeTab="dashboard" />

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
