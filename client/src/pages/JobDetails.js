import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.log("Error fetching job:", err);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();

    try {
      if (!resumeFile) {
        alert("Please upload resume");
        return;
      }

      const formData = new FormData();
      formData.append("resume", resumeFile);

      await API.post(`/applications/${job._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Application submitted successfully");
    } catch (err) {
      console.log("Application error:", err);
      alert("Application failed");
    }
  };

  if (!job) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-3">
          {job.title}
        </h1>

        <p className="text-gray-500">
          {job.company} - {job.location}
        </p>

        <hr className="my-6" />

        <p className="mb-4">{job.description}</p>

        <p className="text-green-600 font-semibold mb-6">
          Salary: {job.salary}
        </p>

        <form onSubmit={handleApply}>
          <input
            type="file"
            onChange={(e) =>
              setResumeFile(e.target.files[0])
            }
            className="mb-4"
          />

          <br />

          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg"
          >
            Apply Now
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default JobDetails;