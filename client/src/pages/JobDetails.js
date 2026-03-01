import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "../components/Layout";
import API from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }

    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const isOwner =
    user?.role === "employer" &&
    job?.employer?._id === user?.id;

  const handleApply = async () => {
    const formData = new FormData();
    formData.append("jobId", job._id);
    if (resume) formData.append("resume", resume);

    try {
      const res = await API.post("/applications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Application failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this job permanently?")) return;

    try {
      await API.delete(`/jobs/${job._id}`);
      navigate("/jobs");
    } catch (error) {
      alert("Error deleting job");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-24 text-gray-500">
          Loading job...
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="text-center py-24 text-red-500">
          Job not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-20">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-indigo-600 hover:underline"
        >
          ← Back
        </button>

        <div className="bg-white shadow-xl rounded-2xl p-10 transition hover:shadow-2xl">

          <h1 className="text-3xl font-bold text-indigo-600 mb-4">
            {job.title}
          </h1>

          <p className="text-lg text-gray-700 mb-1">{job.company}</p>
          <p className="text-gray-500 mb-6">{job.location}</p>

          <div className="border-t pt-6 mb-6">
            <p className="text-gray-700 leading-relaxed">
              {job.description}
            </p>
          </div>

          {job.salary && (
            <p className="text-green-600 font-semibold mb-6">
              Salary: {job.salary}
            </p>
          )}

          {/* Candidate Apply Section */}
          {user?.role === "candidate" && (
            <div className="space-y-4">

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResume(e.target.files[0])}
                className="block"
              />

              <button
                onClick={handleApply}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition transform hover:scale-105"
              >
                Apply Now
              </button>

            </div>
          )}

          {/* Employer Delete Section */}
          {isOwner && (
            <div className="mt-6">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition transform hover:scale-105"
              >
                Delete Job
              </button>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="mt-6 bg-indigo-100 text-indigo-700 p-3 rounded-lg">
              {message}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

export default JobDetails;
