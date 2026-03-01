import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await API.get("/applications/my");
      setApplications(res.data);
    };
    fetchApplications();
  }, []);

  const statusColor = (status) => {
    if (status === "Accepted") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-indigo-600 mb-8">
          My Applications
        </h1>

        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="bg-white shadow p-6 rounded-xl mb-6">
              <h2 className="text-lg font-semibold">
                {app.job.title}
              </h2>
              <p className="text-gray-600">{app.job.company}</p>

              <span
                className={`inline-block mt-3 px-4 py-1 rounded-full text-sm ${statusColor(app.status)}`}
              >
                {app.status}
              </span>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}

export default CandidateDashboard;
