import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import PremiumNav from "../components/PremiumNav";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all jobs
        const jobsRes = await API.get(`/jobs${location.search}`);
        setJobs(jobsRes.data);
        if (jobsRes.data.length > 0) {
          setSelectedJob(jobsRes.data[0]); // Auto-select first job
        }

        // Fetch user's applications to see what they've already applied to
        if (user.role === 'candidate') {
           const appsRes = await API.get("/applications/my");
           setMyApplications(appsRes.data);
        }
      } catch (error) {
        console.log("Error fetching jobs data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search, user.role]);

  // Create a Set of applied job IDs for O(1) lookup
  const appliedJobIds = new Set(myApplications.map(app => app.job?._id || app.job));

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please upload your resume to apply.");
      return;
    }

    try {
      setApplying(true);
      const formData = new FormData();
      formData.append("resume", resumeFile);

      await API.post(`/applications/${selectedJob._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update local state to instantly show "Applied"
      setMyApplications([...myApplications, { job: selectedJob._id, status: 'pending' }]);
      setResumeFile(null);
      alert("Application submitted successfully! Epic!");
    } catch (err) {
      console.log("Application error:", err);
      alert(err.response?.data?.message || "Application failed. Please try again.");
      } finally {
        setApplying(false);
      }
    };

    const handleJobSelect = (job) => {
      setSelectedJob(job);
      // Smoothly scroll window to top (for mobile stacking) and right pane to top (for desktop)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const rightPane = document.getElementById("right-pane");
        if (rightPane) rightPane.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    };

  return (
    <>
      <PremiumNav compact={true} />
      <div className="min-h-screen bg-[#F4F7FE] font-sans flex flex-col pt-[73px]">
      {/* Main Dual-Pane Layout */}
      <div className="flex-1 max-w-[90rem] mx-auto w-full flex flex-col lg:flex-row h-[calc(100vh-73px)] overflow-hidden">
        
        {/* Left Pane - List of Jobs */}
        <div className="w-full lg:w-[450px] flex-shrink-0 bg-white border-r border-slate-100 flex flex-col h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative">
          <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Discover Roles</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Explore {jobs.length} opportunities that match your exceptional skills.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/50">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                 <p className="text-slate-500 font-bold">No jobs found right now.</p>
              </div>
            ) : (
              jobs.map((job) => {
                const isSelected = selectedJob?._id === job._id;
                const hasApplied = appliedJobIds.has(job._id);
                
                return (
                  <div 
                    key={job._id}
                    onClick={() => handleJobSelect(job)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden group ${
                      isSelected 
                        ? "bg-white border-indigo-500 shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-indigo-500 scale-[1.02]" 
                        : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-l-2xl"></div>}
                    
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${isSelected ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"}`}>
                          {job.company?.charAt(0) || 'C'}
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{job.company}</p>
                           <h3 className={`text-base font-bold leading-tight ${isSelected ? "text-indigo-600" : "text-slate-800 group-hover:text-indigo-600"}`}>{job.title}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-md text-[10px] font-bold tracking-wide flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[10px] font-bold tracking-wide">
                          {job.salary}
                        </span>
                      )}
                    </div>

                    {hasApplied && (
                       <div className="mt-4 pt-3 border-t border-slate-50 flex items-center text-emerald-500">
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          <span className="text-[11px] font-bold uppercase tracking-wider">Already Applied</span>
                       </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane - Job Details */}
        <div className="flex-1 bg-[#F4F7FE] overflow-y-auto relative hidden lg:block">
          {!selectedJob ? (
             <div className="h-full flex flex-col items-center justify-center p-12 text-center">
               <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                 <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
               </div>
               <h2 className="text-2xl font-black text-slate-800">Select a role</h2>
               <p className="text-slate-500 mt-2 max-w-sm">Tap on any job listing from the left panel to review the full description and apply directly.</p>
             </div>
          ) : (
             <div className="max-w-4xl mx-auto py-10 px-8 pb-32">
                {/* Header Profile */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
                   
                   <div className="flex items-center space-x-6 relative z-10">
                     <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <span className="text-3xl font-black text-white">{selectedJob.company?.charAt(0)}</span>
                     </div>
                     <div>
                       <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{selectedJob.title}</h1>
                       <p className="text-indigo-600 font-bold text-sm tracking-wide">{selectedJob.company} <span className="text-slate-300 font-normal mx-2">•</span> <span className="text-slate-500 font-medium">{selectedJob.location}</span></p>
                     </div>
                   </div>

                   <div className="mt-6 md:mt-0 relative z-10">
                     {appliedJobIds.has(selectedJob._id) ? (
                       <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-6 py-3 rounded-xl font-bold flex items-center shadow-sm">
                         <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                         Successfully Applied
                       </div>
                     ) : (
                       <a href="#apply-section" className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 transition-all block text-center">
                         Apply Now
                       </a>
                     )}
                   </div>
                </div>

                {/* Info Pills */}
                <div className="flex flex-wrap gap-4 mb-8">
                   <div className="bg-white px-5 py-3 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-3">
                     <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compensation</p>
                       <p className="text-sm font-black text-slate-800">{selectedJob.salary || "Competitive Salary"}</p>
                     </div>
                   </div>
                   <div className="bg-white px-5 py-3 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-3">
                     <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Type</p>
                       <p className="text-sm font-black text-slate-800">Full-Time</p>
                     </div>
                   </div>
                   <div className="bg-white px-5 py-3 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-3">
                     <div className="w-8 h-8 rounded-full bg-fuchsia-50 text-fuchsia-500 flex items-center justify-center">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posted</p>
                       <p className="text-sm font-black text-slate-800">{new Date(selectedJob.createdAt).toLocaleDateString()}</p>
                     </div>
                   </div>
                </div>

                {/* Job Description */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                    Role Description
                  </h3>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
                  </div>
                </div>

                {/* Application Section */}
                <div id="apply-section" className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                   
                   <div className="relative z-10">
                     <h3 className="text-2xl font-black text-white mb-2">Ready to make an impact?</h3>
                     <p className="text-indigo-200 mb-8 max-w-md text-sm">Submit your resume directly to the hiring team at {selectedJob.company}. You're just one click away from your next big opportunity.</p>
                     
                     {appliedJobIds.has(selectedJob._id) ? (
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          </div>
                          <h4 className="text-xl font-bold text-white mb-1">Application Sent!</h4>
                          <p className="text-emerald-200 text-sm">We've forwarded your profile to the employer. Good luck!</p>
                        </div>
                     ) : (
                        <form onSubmit={handleApply} className="bg-white rounded-2xl p-6 shadow-2xl">
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Upload your Resume (PDF)</label>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => setResumeFile(e.target.files[0])}
                              className="w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer border-2 border-dashed border-slate-200 rounded-xl p-2 transition-colors focus:border-indigo-500 outline-none"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={applying || !resumeFile}
                            className="mt-6 w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm flex justify-center items-center h-14"
                          >
                            {applying ? (
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                              "Submit Application"
                            )}
                          </button>
                        </form>
                     )}
                   </div>
                </div>
             </div>
          )}
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}} />
    </div>
    </>
  );
}

export default Jobs;