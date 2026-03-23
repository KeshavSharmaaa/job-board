import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import PremiumNav from "../components/PremiumNav";

function PostJob() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/jobs", form);
      // Wait a moment then redirect to dashboard
      setTimeout(() => navigate("/employer-dashboard"), 500);
    } catch (error) {
      console.log("POST ERROR:", error.response?.data);
      alert(error.response?.data?.message || "Error posting job ❌");
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
      <div className="min-h-[120vh] bg-[#F4F7FE] font-sans pt-12 pb-10">

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
              <Link to="/employer-dashboard" className="w-full flex items-center space-x-3 text-slate-500 font-semibold px-4 py-3.5 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                <span>Dashboard</span>
              </Link>
              <button className="w-full flex items-center justify-between text-indigo-600 bg-indigo-50 font-bold px-4 py-3.5 rounded-2xl transition-all shadow-sm cursor-default">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  <span>Post New Job</span>
                </div>
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
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 min-h-[500px] overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-10 relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-black text-white mb-2">Create a New Posting</h1>
                <p className="text-indigo-100 text-sm font-medium">Find the perfect candidate by providing clear role expectations.</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div className="absolute top-0 right-20 w-32 h-32 bg-indigo-400 opacity-20 rounded-full blur-xl"></div>
            </div>

            <div className="p-8 sm:p-12">
              <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Job Title <span className="text-rose-500">*</span></label>
                    <input
                      name="title"
                      placeholder="e.g. Senior Product Designer"
                      onChange={handleChange}
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold text-slate-800 placeholder-slate-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Company Name <span className="text-rose-500">*</span></label>
                    <input
                      name="company"
                      placeholder="e.g. Tech Solutions Inc."
                      onChange={handleChange}
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold text-slate-800 placeholder-slate-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Location <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <input
                        name="location"
                        placeholder="e.g. Remote, NY"
                        onChange={handleChange}
                        className="w-full border-2 border-slate-100 rounded-xl pl-11 pr-4 py-3.5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold text-slate-800 placeholder-slate-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Salary Range</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 font-bold text-slate-400">$</span>
                      <input
                        name="salary"
                        placeholder="e.g. 100k - 120k"
                        onChange={handleChange}
                        className="w-full border-2 border-slate-100 rounded-xl pl-8 pr-4 py-3.5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-bold text-slate-800 placeholder-slate-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Role Description <span className="text-rose-500">*</span></label>
                  <textarea
                    name="description"
                    placeholder="Describe the responsibilities, requirements, and perks..."
                    onChange={handleChange}
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm text-slate-600 placeholder-slate-300 min-h-[160px]"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-bold uppercase tracking-wider text-sm flex items-center space-x-2 group"
                  >
                    <span>Publish Listing</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default PostJob;
