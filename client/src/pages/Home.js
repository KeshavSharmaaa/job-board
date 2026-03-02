import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";
import API from "../services/api";

function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data.slice(0, 3));
      } catch (err) {
        console.log(err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Layout>
      <Hero />
      <SearchBar />

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-indigo-600 text-center mb-10">
            Featured Jobs
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Home;