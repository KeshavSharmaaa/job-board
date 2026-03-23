import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import PremiumNav from "../components/PremiumNav";

function Home() {
  return (
    <>
      <PremiumNav />
      <Layout>
      <div className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-slate-950 font-sans">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/30 blur-[120px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-300 tracking-wide">The Premier Job Board Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight">
            Find Your Next <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
              Dream Opportunity
            </span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-12">
            Connect with top employers and elite candidates. Experience a seamless hiring journey backed by cutting-edge design and powerful tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md sm:max-w-none">
            <Link 
              to="/jobs" 
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] hover:-translate-y-1"
            >
              Browse Jobs
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </Link>

            <Link 
              to="/post-job" 
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-slate-300 transition-all duration-200 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white backdrop-blur-md hover:-translate-y-1"
            >
              Post a Job
              <svg className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </Link>
          </div>

        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
      </div>
    </Layout>
    </>
  );
}

export default Home;