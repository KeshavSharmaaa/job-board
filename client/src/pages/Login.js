import { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto py-20">
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
        <button className="w-full bg-indigo-600 text-white p-3 rounded">
          Login
        </button>
      </form>
    </Layout>
  );
}

export default Login;