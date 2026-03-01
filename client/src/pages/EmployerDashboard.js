import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function EmployerDashboard() {
  const [applications, setApplications] = useState([]);

  const fetchApplicants = async () => {
    const res = await API.get("/applications/employer");
    setApplications(res.data);
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/applications/${id}/status`, { status });
    fetchApplicants();
  };

  const statusStyle = (status) => {
    if (status === "Accepted") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-indigo-600 mb-8">
          Applicants
        </h1>

        {applications.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              className="bg-white shadow-lg rounded-xl p-6 mb-6 transition hover:shadow-2xl"
            >
              <h2 className="font-semibold text-lg">
                {app.job.title}
              </h2>

              <p className="text-gray-600">
                {app.candidate.name} ({app.candidate.email})
              </p>

              {app.resume && (
                <a
                  href={`http://localhost:5000/${app.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline block mt-2"
                >
                  View Resume
                </a>
              )}

              <span
                className={`inline-block mt-4 px-4 py-1 rounded-full text-sm ${statusStyle(app.status)}`}
              >
                {app.status}
              </span>

              {app.status === "Pending" && (
                <div className="mt-4 space-x-4">
                  <button
                    onClick={() => updateStatus(app._id, "Accepted")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "Rejected")}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}

export default EmployerDashboard;
