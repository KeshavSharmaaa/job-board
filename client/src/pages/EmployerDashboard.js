import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // =============================
  // FETCH EMPLOYER JOBS
  // =============================
  const fetchEmployerJobs = async () => {
    try {
      const res = await API.get("/jobs");

      // Only show jobs posted by this employer
      const myJobs = res.data.filter(
        (job) => job.employer?._id === user?.id
      );

      setJobs(myJobs);
    } catch (err) {
      console.log("Error fetching employer jobs:", err);
    }
  };

  // =============================
  // FETCH APPLICATIONS FOR A JOB
  // =============================
  const fetchApplications = async (jobId) => {
    try {
      const res = await API.get(`/applications/job/${jobId}`);

      setApplications((prev) => ({
        ...prev,
        [jobId]: res.data,
      }));
    } catch (err) {
      console.log("Error fetching applications:", err);
    }
  };

  // =============================
  // UPDATE APPLICATION STATUS
  // =============================
  const updateStatus = async (applicationId, status, jobId) => {
    try {
      await API.put(`/applications/${applicationId}/status`, {
        status,
      });

      alert("Status updated successfully");

      // Refresh applications
      fetchApplications(jobId);
    } catch (err) {
      console.log("Status update error:", err);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchEmployerJobs();
      setLoading(false);
    };

    init();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-20 px-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-10">
          Employer Dashboard
        </h1>

        {loading && <p>Loading...</p>}

        {!loading && jobs.length === 0 && (
          <p>No jobs posted yet.</p>
        )}

        {jobs.map((job) => (
          <div
            key={job._id}
            className="mb-12 p-6 bg-white rounded-xl shadow"
          >
            <h2 className="text-xl font-semibold text-indigo-600">
              {job.title}
            </h2>
            <p className="text-gray-500 mb-4">
              {job.company} - {job.location}
            </p>

            <button
              onClick={() => fetchApplications(job._id)}
              className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded"
            >
              View Applications
            </button>

            {applications[job._id] &&
              applications[job._id].length === 0 && (
                <p>No applications yet.</p>
              )}

            {applications[job._id] &&
              applications[job._id].map((app) => (
                <div
                  key={app._id}
                  className="border p-4 mb-3 rounded"
                >
                  <p>
                    <strong>Candidate:</strong>{" "}
                    {app.candidate?.name}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="text-blue-600">
                      {app.status}
                    </span>
                  </p>

                  {app.resume && (
                    <a
                      href={`${process.env.REACT_APP_API_URL}/${app.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 underline"
                    >
                      View Resume
                    </a>
                  )}

                  {app.status === "pending" && (
                    <div className="mt-3 space-x-3">
                      <button
                        onClick={() =>
                          updateStatus(
                            app._id,
                            "accepted",
                            job._id
                          )
                        }
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            app._id,
                            "rejected",
                            job._id
                          )
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default EmployerDashboard;