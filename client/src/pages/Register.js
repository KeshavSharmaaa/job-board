import { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import PremiumNav from "../components/PremiumNav";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sanitizedForm = {
        ...form,
        email: form.email.trim(),
        password: form.password.trim(),
      };
      await API.post("/auth/register", sanitizedForm);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PremiumNav />
      <Layout>
      <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-400/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[100px] pointer-events-none"></div>

        <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white relative z-10">
          <div>
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-fuchsia-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-fuchsia-500/30 transform -rotate-3">
              <svg className="w-8 h-8 text-white rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
              Join Us Today
            </h2>
            <p className="mt-3 text-center text-sm text-slate-500 font-medium">
              Create an account to start your journey
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm px-4 py-3 rounded-xl flex items-center animate-pulse">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-5 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm transition-all bg-slate-50 hover:bg-white"
                  placeholder="John Doe"
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-5 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm transition-all bg-slate-50 hover:bg-white"
                  placeholder="name@example.com"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-5 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm transition-all bg-slate-50 hover:bg-white"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">I am a...</label>
                <div className="relative">
                  <select
                    name="role"
                    onChange={handleChange}
                    className="appearance-none block w-full px-5 py-3.5 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm transition-all bg-slate-50 hover:bg-white cursor-pointer font-medium"
                  >
                    <option value="candidate">Candidate (Looking for Jobs)</option>
                    <option value="employer">Employer (Hiring Talent)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-all shadow-lg shadow-fuchsia-500/30 disabled:opacity-70 transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Creating account...
                  </span>
                ) : "Sign Up"}
              </button>
            </div>
            
            <div className="text-center pt-2">
              <p className="text-sm text-slate-500 font-medium">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-fuchsia-600 hover:text-fuchsia-500 transition-colors">
                  Sign in instead
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
    </>
  );
}

export default Register;