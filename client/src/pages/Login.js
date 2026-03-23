import { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import PremiumNav from "../components/PremiumNav";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sanitizedForm = {
        email: form.email.trim(),
        password: form.password.trim(),
      };
      const res = await API.post("/auth/login", sanitizedForm);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user for dashboards
      
      // Redirect based on role
      if (res.data.user.role === "employer") {
        navigate("/employer-dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
        <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[100px] pointer-events-none"></div>

        <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white relative z-10">
          <div>
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 transform rotate-3">
              <svg className="w-8 h-8 text-white -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-3 text-center text-sm text-slate-500 font-medium">
              We're thrilled to see you again
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm px-4 py-3 rounded-xl flex items-center animate-pulse">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-5 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all bg-slate-50 hover:bg-white"
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
                  className="appearance-none relative block w-full px-5 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all bg-slate-50 hover:bg-white"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-70 transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Signing in...
                  </span>
                ) : "Sign in"}
              </button>
            </div>
            
            <div className="text-center pt-2">
              <p className="text-sm text-slate-500 font-medium">
                Don't have an account?{" "}
                <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Create one now
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

export default Login;