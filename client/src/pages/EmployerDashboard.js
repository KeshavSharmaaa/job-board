import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState(null); // Which job's applicants to show

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchApplications = async (jobId) => {
    try {
      if (activeJob === jobId) {
        setActiveJob(null); // toggle off
        return;
      }
      const res = await API.get(`/applications/job/${jobId}`);
      setApplications((prev) => ({
        ...prev,
        [jobId]: res.data,
      }));
      setActiveJob(jobId);
    } catch (err) {
      console.log("Error fetching applications:", err);
    }
  };

  const updateStatus = async (applicationId, status, jobId) => {
    try {
      await API.put(`/applications/${applicationId}/status`, { status });
      // Refresh the applications
      const res = await API.get(`/applications/job/${jobId}`);
      setApplications((prev) => ({ ...prev, [jobId]: res.data }));
    } catch (err) {
      console.log("Status update error:", err);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const res = await API.get("/jobs");
        const myJobs = res.data.filter((job) => job.employer?._id === user?.id);
        setJobs(myJobs);
      } catch (err) {
        console.log("Error fetching employer jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchEmployerJobs();
  }, [user?.id]);

  return (
    <Layout>
      <div className="min-h-[80vh] bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Panel */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10 mb-10 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            <div className="relative z-10 text-center sm:text-left mb-6 sm:mb-0">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Employer <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Dashboard</span>
              </h1>
              <p className="mt-2 text-slate-500 text-lg">Manage your job postings and applicants seamlessly.</p>
            </div>
            <div className="relative z-10">
              <Link to="/post-job" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Post New Job
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center max-w-2xl mx-auto">
              <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Jobs Posted</h3>
              <p className="text-slate-500 mb-6">Create your first job listing to start receiving applications from top candidates.</p>
              <Link to="/post-job" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">Post a Job &rarr;</Link>
            </div>
          ) : (
             <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
               {/* Left column: Job list */}
               <div className="lg:col-span-5 space-y-4">
                 <h2 className="text-xl font-bold text-slate-800 mb-6 px-1">Your Active Listings</h2>
                 {jobs.map((job) => (
                   <div 
                     key={job._id} 
                     onClick={() => fetchApplications(job._id)}
                     className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border ${activeJob === job._id ? 'bg-indigo-600 border-indigo-600 shadow-lg scale-[1.02]' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}
                   >
                     <h3 className={`text-lg font-bold truncate ${activeJob === job._id ? 'text-white' : 'text-slate-900'}`}>{job.title}</h3>
                     <p className={`text-sm mt-1 flex items-center ${activeJob === job._id ? 'text-indigo-100' : 'text-slate-500'}`}>
                       <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                       {job.location}
                     </p>
                     <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                       <span className={`text-sm font-medium ${activeJob === job._id ? 'text-white' : 'text-indigo-600'}`}>
                         {activeJob === job._id ? 'Viewing Applicants' : 'View Applicants'} &rarr;
                       </span>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Right column: Applicants */}
               <div className="lg:col-span-7">
                 <div className="bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col overflow-hidden">
                    {activeJob ? (
                      <div className="p-0">
                        <div className="bg-slate-50 border-b border-slate-100 p-6">
                           <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                             <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                             Applicants for {jobs.find(j => j._id === activeJob)?.title}
                           </h3>
                        </div>
                        <div className="p-6">
                          {!applications[activeJob] ? (
                            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
                          ) : applications[activeJob].length === 0 ? (
                            <div className="text-center py-12">
                               <p className="text-slate-500">No applications received yet for this position.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {applications[activeJob].map((app) => (
                                <div key={app._id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                  <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-auto">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mr-4">
                                      {app.candidate?.name?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-slate-900">{app.candidate?.name}</h4>
                                      <p className="text-sm text-slate-500 capitalize">Status: <span className={app.status === 'accepted' ? 'text-emerald-600' : app.status === 'rejected' ? 'text-rose-600' : 'text-amber-600'}>{app.status}</span></p>
                                    </div>
                                  </div>
                                  
                                  {app.status === "pending" && (
                                    <div className="flex space-x-2 w-full sm:w-auto mt-2 sm:mt-0">
                                      <button onClick={() => updateStatus(app._id, "accepted", activeJob)} className="flex-1 sm:flex-none px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-full text-sm font-medium transition-colors">
                                        Accept
                                      </button>
                                      <button onClick={() => updateStatus(app._id, "rejected", activeJob)} className="flex-1 sm:flex-none px-4 py-2 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-full text-sm font-medium transition-colors">
                                        Reject
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-60">
                         <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                         <h3 className="text-xl font-medium text-slate-800 mb-2">Select a Job</h3>
                         <p className="text-slate-500 max-w-sm">Click on any of your active job listings on the left to view and manage applicants.</p>
                      </div>
                    )}
                 </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default EmployerDashboard;