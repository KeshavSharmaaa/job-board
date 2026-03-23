import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { API_BASE_URL } from "../services/api";
import PremiumNav from "../components/PremiumNav";

function EmployerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const res = await API.get("/jobs");
        const myJobs = res.data.filter((job) => job.employer?._id === user?.id);
        setJobs(myJobs);
      } catch (err) {
        console.error("Error fetching employer jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchEmployerJobs();
  }, [user?.id]);

  const fetchApplications = async (jobId) => {
    try {
      if (activeJob === jobId) {
        setActiveJob(null);
        return;
      }
      const res = await API.get(`/applications/job/${jobId}`);
      if (res.data) {
        setApplications((prev) => ({ ...prev, [jobId]: res.data }));
        setActiveJob(jobId);
      }
    } catch (err) {
      console.log("Error fetching applications:", err);
    }
  };

  const updateStatus = async (appId, status, jobId) => {
    try {
      await API.put(`/applications/${appId}/status`, { status });
      const res = await API.get(`/applications/job/${jobId}`);
      setApplications((prev) => ({ ...prev, [jobId]: res.data }));
    } catch (err) {
      console.log("Status update error:", err);
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <PremiumNav compact={true} />
      <div className="min-h-screen bg-[#F4F7FE] font-sans pt-12 pb-10">
      {/* Main Container */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-[280px] flex-shrink-0">
          <div className="bg-white rounded-[2rem] shadow-sm p-8 flex flex-col items-center border border-slate-100">
            {/* Profile Pic */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-slate-50 overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-4xl font-black text-indigo-600">{user.name ? user.name.charAt(0).toUpperCase() : 'C'}</span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-800 text-center">{user.name || "Tech Solutions Inc."}</h2>
            <p className="text-[11px] text-slate-400 mt-2 text-center uppercase tracking-wider font-semibold">Premium Employer<br/>Verified Company</p>
            
            <div className="w-full h-px bg-slate-100 my-6"></div>

            <div className="w-full space-y-2">
              <button className="w-full flex items-center space-x-3 text-indigo-600 bg-indigo-50 font-bold px-4 py-3.5 rounded-2xl transition-all shadow-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                <span>Dashboard</span>
              </button>
              <Link to="/post-job" className="w-full flex items-center justify-between text-slate-500 font-semibold px-4 py-3.5 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  <span>Post New Job</span>
                </div>
              </Link>
              <button className="w-full flex items-center space-x-3 text-slate-500 font-semibold px-4 py-3.5 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <span>Active Listings</span>
              </button>
              <button className="w-full flex items-center space-x-3 text-slate-500 font-semibold px-4 py-3.5 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                <span>Team Members</span>
              </button>
              
              <button onClick={handleLogout} className="w-full flex items-center space-x-3 text-slate-500 font-semibold px-4 py-3.5 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-colors mt-4">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-6">
          
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-sm flex items-start justify-between h-28 relative overflow-hidden">
              <span className="font-semibold text-indigo-100 text-sm">Active Listings</span>
              <span className="text-4xl font-black">{jobs.length}</span>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-indigo-400 opacity-50 rounded-full"></div>
            </div>
            <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl p-6 text-white shadow-sm flex items-start justify-between h-28 relative overflow-hidden">
              <span className="font-semibold text-emerald-50 text-sm">Total Applicants</span>
              <span className="text-4xl font-black">
                {Object.values(applications).reduce((acc, curr) => acc + curr.length, 0) || 0}
              </span>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-300 opacity-50 rounded-full"></div>
            </div>
            <div className="bg-gradient-to-r from-sky-400 to-sky-500 rounded-2xl p-6 text-white shadow-sm flex items-start justify-between h-28 relative overflow-hidden">
              <span className="font-semibold text-sky-50 text-sm">Profile Views</span>
              <span className="text-4xl font-black">1.2K</span>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-sky-300 opacity-50 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Jobs List */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-[2rem] shadow-sm p-6 border border-slate-100 min-h-[500px]">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-lg font-bold text-slate-800 tracking-tight">Your Positions</h2>
                   <Link to="/post-job" className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800">View All &rsaquo;</Link>
                </div>
                
                {loading ? (
                  <div className="py-10 flex justify-center"><div className="animate-spin inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div></div>
                ) : jobs.length === 0 ? (
                  <div className="bg-slate-50 rounded-2xl p-6 text-center">
                    <p className="text-slate-500 text-sm font-medium mb-3">No positions posted yet.</p>
                    <Link to="/post-job" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors inline-block tracking-wider uppercase">Post First Job</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {jobs.map((job) => (
                      <div 
                        key={job._id}
                        onClick={() => fetchApplications(job._id)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 group ${activeJob === job._id ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200" : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm"}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${activeJob === job._id ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"}`}>
                            {job.company?.charAt(0) || 'C'}
                          </div>
                          <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md ${activeJob === job._id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                            {activeJob === job._id ? "Viewing" : "Active"}
                          </span>
                        </div>
                        <h3 className={`text-sm font-bold leading-tight mb-1 ${activeJob === job._id ? "text-white" : "text-slate-800 group-hover:text-indigo-600"}`}>{job.title}</h3>
                        <p className={`text-[11px] font-medium ${activeJob === job._id ? "text-indigo-100" : "text-slate-400"}`}>{job.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Applicants View */}
            <div className="lg:col-span-7">
               <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 min-h-[500px] flex flex-col overflow-hidden relative">
                  {!activeJob ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                         <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                       </div>
                       <h3 className="text-xl font-bold text-slate-800 mb-2">Select a Position</h3>
                       <p className="text-slate-500 text-sm max-w-[240px]">Tap on any job listing from the left panel to review candidate applications in detail.</p>
                    </div>
                  ) : (
                    <>
                      <div className="border-b border-slate-100 p-6 flex justify-between items-center bg-slate-50/50">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {jobs.find(j => j._id === activeJob)?.title}
                          </h3>
                          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-0.5">Reviewing Candidates</p>
                        </div>
                        <div className="bg-white px-3 py-1.5 rounded-lg text-indigo-600 font-black shadow-sm border border-slate-100 text-sm flex items-center space-x-2">
                          <span>{applications[activeJob] ? applications[activeJob].length : 0}</span>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total</span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 overflow-y-auto">
                        {!applications[activeJob] ? (
                          <div className="flex justify-center py-10"><div className="animate-spin inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div></div>
                        ) : applications[activeJob].length === 0 ? (
                          <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                             <p className="text-slate-500 font-bold text-sm">No one has applied just yet.</p>
                             <p className="text-slate-400 text-xs mt-1">Check back later or share the job link directly.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {applications[activeJob].map((app) => (
                              <div key={app._id} className="group p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-sm transition-all flex flex-col sm:flex-row items-center justify-between">
                                <div className="flex items-center space-x-4 w-full sm:w-auto">
                                  <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                     <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${app.candidate?.name || 'cand'}`} alt="cand" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{app.candidate?.name}</h4>
                                    <div className="flex items-center mt-1 space-x-2">
                                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : app.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {app.status}
                                      </span>
                                      <span className="text-slate-300">•</span>
                                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Applied {new Date(app.createdAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {app.status === "pending" && (
                                  <div className="flex items-center space-x-2 mt-4 sm:mt-0 w-full sm:w-auto">
                                    {app.resume && (
                                      <a 
                                        href={`${API_BASE_URL}/${app.resume.replace(/\\\\/g, '/')}`} 
                                        download="Resume.pdf"
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex-1 sm:w-auto py-2 px-4 bg-slate-50 text-indigo-600 border border-indigo-100 text-xs tracking-wider uppercase font-bold hover:bg-slate-100 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        <span>Download Resume</span>
                                      </a>
                                    )}
                                    <button onClick={() => updateStatus(app._id, "rejected", activeJob)} className="flex-1 sm:w-10 sm:h-10 flex justify-center items-center py-2 sm:py-0 border border-slate-200 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all" title="Reject">
                                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                    <button onClick={() => updateStatus(app._id, "accepted", activeJob)} className="flex-1 sm:w-auto py-2 px-5 bg-indigo-600 text-white text-xs tracking-wider uppercase font-bold hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-200">
                                      Accept
                                    </button>
                                  </div>
                                )}
                                {app.status !== "pending" && app.resume && (
                                  <div className="mt-4 sm:mt-0">
                                    <a 
                                      href={`${API_BASE_URL}/${app.resume.replace(/\\\\/g, '/')}`} 
                                      download="Resume.pdf"
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="py-1.5 px-4 bg-slate-50 text-indigo-600 border border-slate-200 text-[10px] tracking-wider uppercase font-bold hover:bg-slate-100 rounded-lg transition-all flex items-center justify-center space-x-1"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                      <span>Download Resume</span>
                                    </a>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default EmployerDashboard;