import { useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function PostJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/jobs", form);
      alert("Job Posted Successfully ✅");
      navigate("/jobs");
    } catch (error) {
      console.log("POST ERROR:", error.response?.data);
      alert(error.response?.data?.message || "Error posting job ❌");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-indigo-600 mb-8">
          Post a New Job
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            placeholder="Job Title"
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <input
            name="company"
            placeholder="Company Name"
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <textarea
            name="description"
            placeholder="Job Description"
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 h-40"
            required
          />

          <input
            name="salary"
            placeholder="Salary (optional)"
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Post Job
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default PostJob;
