import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [ps, setPs] = useState([]);
  const [spocs, setSpocs] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ps");
  
  // PS Form
  const [psForm, setPsForm] = useState({
    title: "", description: "", type: "Software", category: "Technology"
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
      setPsForm({ title: "", description: "", type: "Software", category: "Technology" });
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
      setPsForm({ title: "", description: "", type: "Software", category: "Technology" });
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
      type: ps.type,
      category: ps.category
    });
    setShowPSForm(true);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-6">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-300">
          {["ps", "spocs", "submissions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 font-semibold transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab === "ps" ? "Problem Statements" : tab === "spocs" ? "SPOCs" : "Submissions"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading...</div>
        ) : (
          <>
            {/* Problem Statements Tab */}
            {activeTab === "ps" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-black">Problem Statements</h2>
                  <button
                    onClick={() => {
                      setEditingPS(null);
                      setPsForm({ title: "", description: "", type: "Software", category: "Technology" });
                      setShowPSForm(!showPSForm);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    {showPSForm ? "Cancel" : "+ Create Problem Statement"}
                  </button>
                </div>

                {showPSForm && (
                  <form
                    onSubmit={editingPS ? handleUpdatePS : handleCreatePS}
                    className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-black">
                      {editingPS ? "Edit Problem Statement" : "Create Problem Statement"}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-black font-medium mb-2">Title *</label>
                        <input
                          type="text"
                          value={psForm.title}
                          onChange={(e) => setPsForm({ ...psForm, title: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-black"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-black font-medium mb-2">Description *</label>
                        <textarea
                          value={psForm.description}
                          onChange={(e) => setPsForm({ ...psForm, description: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-black min-h-[100px]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-black font-medium mb-2">Type</label>
                        <select
                          value={psForm.type}
                          onChange={(e) => setPsForm({ ...psForm, type: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-black"
                        >
                          <option value="Software">Software</option>
                          <option value="Hardware">Hardware</option>
                          <option value="Student Innovation">Student Innovation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-black font-medium mb-2">Category</label>
                        <select
                          value={psForm.category}
                          onChange={(e) => setPsForm({ ...psForm, category: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-black"
                        >
                          <option value="Healthcare">Healthcare</option>
                          <option value="Technology">Technology</option>
                          <option value="Sustainability">Sustainability</option>
                          <option value="Finance">Finance</option>
                          <option value="Education">Education</option>
                          <option value="Agriculture">Agriculture</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                        >
                          {editingPS ? "Update" : "Create"}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {ps.map((p) => (
                        <tr key={p.id} className="hover:bg-blue-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{p.id}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-black max-w-[200px]">{p.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-[300px] truncate">{p.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{p.type || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{p.category || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(p)}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletePS(p.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SPOCs Tab */}
            {activeTab === "spocs" && (
              <div>
                <h2 className="text-2xl font-semibold text-black mb-6">SPOC Management</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {spocs.map((spoc) => (
                        <tr key={spoc.id} className="hover:bg-blue-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{spoc.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{spoc.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              spoc.verified ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"
                            }`}>
                              {spoc.verified ? "Verified" : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {!spoc.verified && (
                              <button
                                onClick={() => handleVerifySPOC(spoc.id)}
                                className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 font-medium"
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
                <h2 className="text-2xl font-semibold text-black mb-6">All Submissions</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Team</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Problem Statement</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Abstract</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-blue-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{sub.id}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-black">{sub.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{sub.team_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-[200px] truncate">{sub.ps_title}</td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-[300px] truncate">{sub.abstract}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              sub.status === "SUBMITTED" ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
