import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function CandidateDashboard() {
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

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === "accepted") return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
    if (s === "rejected") return "bg-rose-500/10 text-rose-600 border-rose-200";
    return "bg-amber-500/10 text-amber-600 border-amber-200";
  };

  return (
    <Layout>
      <div className="min-h-[80vh] bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Applications</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl">
              Track the status of your job applications and land your dream role.
            </p>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No applications found</h3>
              <p className="text-slate-500">You haven't applied to any jobs yet. Start exploring!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <div key={app._id} className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden transform hover:-translate-y-1">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {app.job.title}
                        </h2>
                        <p className="text-slate-500 font-medium mt-1">{app.job.company}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles(app.status)}`}>
                        {app.status}
                      </span>
                      <span className="text-sm text-slate-400">
                        {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default CandidateDashboard;
