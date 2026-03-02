import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";
import API from "../services/api"; // ✅ USE API SERVICE

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const res = await API.get("/jobs"); // ✅ NO localhost
        setJobs(res.data.slice(0, 3));
      } catch (error) {
        console.log("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  return (
    <Layout>
      {/* HERO SECTION */}
      <Hero />

      {/* SEARCH SECTION */}
      <SearchBar />

      {/* FEATURED JOBS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-indigo-600">
              Featured Jobs
            </h2>
            <p className="text-gray-600 mt-4">
              Explore the latest opportunities from top companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p className="text-center col-span-3 text-gray-500">
                Loading jobs...
              </p>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-500">
                No jobs available yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div className="p-8 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">
              Verified Employers
            </h3>
            <p className="text-gray-600">
              All companies are verified to ensure safe and genuine opportunities.
            </p>
          </div>

          <div className="p-8 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">
              Easy Applications
            </h3>
            <p className="text-gray-600">
              Apply quickly with resume upload and one-click apply.
            </p>
          </div>

          <div className="p-8 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">
              Career Growth
            </h3>
            <p className="text-gray-600">
              Find roles that match your skills and grow professionally.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Home;