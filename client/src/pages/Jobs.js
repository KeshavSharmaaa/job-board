import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import JobCard from "../components/JobCard";
import { useLocation } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/api/jobs${location.search}`
        );

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

        {/* Page Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">
            Browse Available Jobs
          </h1>
          <p className="text-gray-600">
            Find opportunities that match your skills and career goals.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500 text-lg">
            Loading jobs...
          </div>
        )}

        {/* No Jobs Found */}
        {!loading && jobs.length === 0 && (
          <div className="text-center text-gray-500 text-lg">
            No jobs found.
          </div>
        )}

        {/* Jobs Grid */}
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
