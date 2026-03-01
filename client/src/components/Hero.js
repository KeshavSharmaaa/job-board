import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-6 py-28 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-xl">
          <h4 className="text-lg mb-4 opacity-90">
            4500+ Jobs Listed
          </h4>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Dream Job
          </h1>

          <p className="text-lg mb-8 opacity-90">
            Discover top opportunities from leading companies
            and grow your career with confidence.
          </p>

          <div className="flex gap-4">
            <Link
              to="/jobs"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Browse Jobs
            </Link>

            <Link
              to="/post-job"
              className="bg-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Post a Job
            </Link>
          </div>
        </div>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="hero"
          className="w-96 mt-10 md:mt-0 drop-shadow-xl"
        />
      </div>
    </section>
  );
}

export default Hero;
