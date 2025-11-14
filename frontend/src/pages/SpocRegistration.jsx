import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function SpocRegistration() {
  const [form, setForm] = useState({
    name: "", age: "", email: "", phone: "", institution: "", password: "", pdf: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => setForm({ ...form, pdf: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      const res = await api.post("/api/auth/register-spoc", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      setForm({ name: "", age: "", email: "", phone: "", institution: "", password: "", pdf: null });
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-2xl"
      >
        <h2 className="text-4xl font-bold text-center mb-2 text-gray-800">
          SPOC Registration
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Register as a Single Point of Contact for your institution
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
            <input
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              className="input"
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Age *</label>
            <input
              name="age"
              type="number"
              placeholder="Enter your age"
              value={form.age}
              className="input"
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email *</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              className="input"
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
            <input
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              className="input"
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Institution Name *</label>
            <input
              name="institution"
              placeholder="Enter your institution name"
              value={form.institution}
              className="input"
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Password *</label>
            <input
              name="password"
              type="password"
              placeholder="Set a secure password"
              value={form.password}
              className="input"
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Upload Nomination PDF *
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFile}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
            {form.pdf && (
              <p className="text-sm text-green-600 mt-1">Selected: {form.pdf.name}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold text-lg mt-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Register as SPOC"}
        </button>
      </motion.form>
    </div>
  );
}
