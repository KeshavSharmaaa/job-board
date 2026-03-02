import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import JobCard from "../components/JobCard";
import { useLocation } from "react-router-dom";
import API from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/jobs${location.search}`);
        setJobs(res.data);
      } catch (error) {
        console.log("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [location.search]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">
            Browse Available Jobs
          </h1>
          <p className="text-gray-600">
            Find opportunities that match your skills and career goals.
          </p>
        </div>

        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {!loading && jobs.length === 0 && (
          <p className="text-center text-gray-500">No jobs found.</p>
        )}

        {!loading && jobs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Jobs;