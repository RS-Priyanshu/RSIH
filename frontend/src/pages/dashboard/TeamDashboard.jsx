import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function TeamDashboard() {
  const [ps, setPs] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [teamId, setTeamId] = useState(null);

  const [submitForm, setSubmitForm] = useState({
    psId: "",
    title: "",
    abstract: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [psRes, subsRes, teamRes] = await Promise.all([
        api.get("/api/team/ps"),
        api.get("/api/team/submissions").catch(() => ({ data: [] })),
        api.get("/api/team/team").catch(() => ({ data: null }))
      ]);
      setPs(psRes.data);
      setSubmissions(subsRes.data || []);
      if (teamRes.data) setTeamId(teamRes.data.id);
    } catch (err) {
      toast.error("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIdea = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/team/submit", {
        ...submitForm,
        teamId: teamId || undefined // Backend will find it if not provided
      });
      toast.success("Idea submitted successfully!");
      setShowSubmitForm(false);
      setSubmitForm({ psId: "", title: "", abstract: "" });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to submit idea");
    }
  };

  const getSelectedPS = () => {
    return ps.find(p => p.id === parseInt(submitForm.psId));
  };

  const hasSubmissionForPS = (psId) => {
    return submissions.some(sub => sub.ps_id === psId);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-6">
          Team Leader Dashboard
        </h1>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-black">Available Problem Statements</h2>
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            {showSubmitForm ? "Cancel" : "+ Submit New Idea"}
          </button>
        </div>

        {showSubmitForm && (
          <form
            onSubmit={handleSubmitIdea}
            className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-4 text-black">Submit Your Idea</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-black font-medium mb-2">Select Problem Statement *</label>
                <select
                  value={submitForm.psId}
                  onChange={(e) => setSubmitForm({ ...submitForm, psId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-black"
                  required
                >
                  <option value="">Choose a problem statement...</option>
                  {ps
                    .filter(p => !hasSubmissionForPS(p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.type || "N/A"})
                      </option>
                    ))}
                </select>
                {submitForm.psId && getSelectedPS() && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-black mb-2">
                      {getSelectedPS().title}
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">{getSelectedPS().description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Type: {getSelectedPS().type || "N/A"}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-800">
                        Category: {getSelectedPS().category || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-black font-medium mb-2">Idea Title *</label>
                <input
                  type="text"
                  value={submitForm.title}
                  onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-black"
                  placeholder="Enter your idea title"
                  required
                />
              </div>
              <div>
                <label className="block text-black font-medium mb-2">Abstract/Description *</label>
                <textarea
                  value={submitForm.abstract}
                  onChange={(e) => setSubmitForm({ ...submitForm, abstract: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-black min-h-[150px]"
                  placeholder="Describe your idea, approach, and expected impact..."
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Submit Idea
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading problem statements...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ps.map((p) => {
                    const hasSubmitted = hasSubmissionForPS(p.id);
                    return (
                      <tr key={p.id} className="hover:bg-blue-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{p.id}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-black max-w-[200px]">{p.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-[300px] truncate">{p.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{p.type || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{p.category || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hasSubmitted ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              Submitted
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-medium">
                              Available
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {hasSubmitted && (
                            <button
                              onClick={() => {
                                const sub = submissions.find(s => s.ps_id === p.id);
                                if (sub) {
                                  toast.info(`Submission: ${sub.title}\n${sub.abstract}`);
                                }
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium"
                            >
                              View Submission
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* My Submissions */}
            {submissions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <h2 className="text-2xl font-semibold text-black mb-4 p-6 border-b border-gray-200">My Submissions</h2>
                <table className="w-full">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Problem Statement ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Abstract</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Submitted Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-blue-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{sub.id}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-black">{sub.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{sub.ps_id}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-[300px] truncate">{sub.abstract}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            sub.status === "SUBMITTED" ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(sub.created_at || Date.now()).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
