import { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto py-20">
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full mb-4 border p-3"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-4 border p-3"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 border p-3"
        />
        <select
          name="role"
          onChange={handleChange}
          className="w-full mb-4 border p-3"
        >
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>
        <button className="w-full bg-indigo-600 text-white p-3 rounded">
          Register
        </button>
      </form>
    </Layout>
  );
}

export default Register;