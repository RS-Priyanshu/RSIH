import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [ps, setPs] = useState([]);
  const [spocs, setSpocs] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ps");
  
  // PS Form
  const [psForm, setPsForm] = useState({
    title: "", description: "", difficulty: "MEDIUM", status: "OPEN"
  });
  const [editingPS, setEditingPS] = useState(null);
  const [showPSForm, setShowPSForm] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [psRes, spocsRes, subsRes] = await Promise.all([
        api.get("/api/admin/ps"),
        api.get("/api/admin/spocs"),
        api.get("/api/admin/submissions")
      ]);
      setPs(psRes.data);
      setSpocs(spocsRes.data);
      setSubmissions(subsRes.data);
    } catch (err) {
      toast.error("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePS = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/ps", psForm);
      toast.success("Problem statement created!");
      setShowPSForm(false);
      setPsForm({ title: "", description: "", difficulty: "MEDIUM", status: "OPEN" });
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create PS");
    }
  };

  const handleUpdatePS = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/admin/ps/${editingPS.id}`, psForm);
      toast.success("Problem statement updated!");
      setEditingPS(null);
      setShowPSForm(false);
      setPsForm({ title: "", description: "", difficulty: "MEDIUM", status: "OPEN" });
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update PS");
    }
  };

  const handleDeletePS = async (id) => {
    if (!confirm("Are you sure you want to delete this problem statement?")) return;
    try {
      await api.delete(`/api/admin/ps/${id}`);
      toast.success("Problem statement deleted!");
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete PS");
    }
  };

  const handleVerifySPOC = async (id) => {
    try {
      await api.put(`/api/admin/spoc/${id}/verify`);
      toast.success("SPOC verified!");
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to verify SPOC");
    }
  };

  const startEdit = (ps) => {
    setEditingPS(ps);
    setPsForm({
      title: ps.title,
      description: ps.description,
      difficulty: ps.difficulty,
      status: ps.status
    });
    setShowPSForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800 mb-6"
        >
          Admin Dashboard
        </motion.h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-300">
          {["ps", "spocs", "submissions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 font-semibold transition-colors ${
                activeTab === tab
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab === "ps" ? "Problem Statements" : tab === "spocs" ? "SPOCs" : "Submissions"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <>
            {/* Problem Statements Tab */}
            {activeTab === "ps" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-700">Problem Statements</h2>
                  <button
                    onClick={() => {
                      setEditingPS(null);
                      setPsForm({ title: "", description: "", difficulty: "MEDIUM", status: "OPEN" });
                      setShowPSForm(!showPSForm);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    {showPSForm ? "Cancel" : "+ Create Problem Statement"}
                  </button>
                </div>

                {showPSForm && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={editingPS ? handleUpdatePS : handleCreatePS}
                    className="bg-white p-6 rounded-lg shadow-md mb-6"
                  >
                    <h3 className="text-xl font-semibold mb-4">
                      {editingPS ? "Edit Problem Statement" : "Create Problem Statement"}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">Title *</label>
                        <input
                          type="text"
                          value={psForm.title}
                          onChange={(e) => setPsForm({ ...psForm, title: e.target.value })}
                          className="input"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">Description *</label>
                        <textarea
                          value={psForm.description}
                          onChange={(e) => setPsForm({ ...psForm, description: e.target.value })}
                          className="input min-h-[100px]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Difficulty</label>
                        <select
                          value={psForm.difficulty}
                          onChange={(e) => setPsForm({ ...psForm, difficulty: e.target.value })}
                          className="input"
                        >
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Status</label>
                        <select
                          value={psForm.status}
                          onChange={(e) => setPsForm({ ...psForm, status: e.target.value })}
                          className="input"
                        >
                          <option value="OPEN">Open</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                        >
                          {editingPS ? "Update" : "Create"}
                        </button>
                      </div>
                    </div>
                  </motion.form>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ps.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{p.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{p.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          p.difficulty === "EASY" ? "bg-green-100 text-green-800" :
                          p.difficulty === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {p.difficulty}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          p.status === "OPEN" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePS(p.id)}
                          className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* SPOCs Tab */}
            {activeTab === "spocs" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">SPOC Management</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {spocs.map((spoc) => (
                        <tr key={spoc.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spoc.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{spoc.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              spoc.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {spoc.verified ? "Verified" : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {!spoc.verified && (
                              <button
                                onClick={() => handleVerifySPOC(spoc.id)}
                                className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
                              >
                                Verify
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === "submissions" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">All Submissions</h2>
                <div className="grid gap-6">
                  {submissions.map((sub) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">{sub.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          sub.status === "SUBMITTED" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Team:</strong> {sub.team_name}
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        <strong>Problem Statement:</strong> {sub.ps_title}
                      </p>
                      <p className="text-gray-700">{sub.abstract}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
