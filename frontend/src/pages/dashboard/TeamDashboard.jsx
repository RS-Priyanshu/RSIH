import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800 mb-6"
        >
          Team Leader Dashboard
        </motion.h1>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Available Problem Statements</h2>
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
          >
            {showSubmitForm ? "Cancel" : "+ Submit New Idea"}
          </button>
        </div>

        {showSubmitForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmitIdea}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <h3 className="text-xl font-semibold mb-4">Submit Your Idea</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Select Problem Statement *</label>
                <select
                  value={submitForm.psId}
                  onChange={(e) => setSubmitForm({ ...submitForm, psId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Choose a problem statement...</option>
                  {ps
                    .filter(p => !hasSubmissionForPS(p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.difficulty})
                      </option>
                    ))}
                </select>
                {submitForm.psId && getSelectedPS() && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {getSelectedPS().title}
                    </h4>
                    <p className="text-gray-600 text-sm">{getSelectedPS().description}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                      getSelectedPS().difficulty === "EASY" ? "bg-green-100 text-green-800" :
                      getSelectedPS().difficulty === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {getSelectedPS().difficulty}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Idea Title *</label>
                <input
                  type="text"
                  value={submitForm.title}
                  onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                  className="input"
                  placeholder="Enter your idea title"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Abstract/Description *</label>
                <textarea
                  value={submitForm.abstract}
                  onChange={(e) => setSubmitForm({ ...submitForm, abstract: e.target.value })}
                  className="input min-h-[150px]"
                  placeholder="Describe your idea, approach, and expected impact..."
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Submit Idea
              </button>
            </div>
          </motion.form>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading problem statements...</div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {ps.map((p, index) => {
                const hasSubmitted = hasSubmissionForPS(p.id);
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
                      hasSubmitted ? "border-blue-500" : "border-green-500"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 flex-1">{p.title}</h3>
                      {hasSubmitted && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          Submitted
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        p.difficulty === "EASY" ? "bg-green-100 text-green-800" :
                        p.difficulty === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {p.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        p.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    {hasSubmitted && (
                      <button
                        onClick={() => {
                          const sub = submissions.find(s => s.ps_id === p.id);
                          if (sub) {
                            toast.info(`Submission: ${sub.title}\n${sub.abstract}`);
                          }
                        }}
                        className="w-full mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium"
                      >
                        View Submission
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* My Submissions */}
            {submissions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Submissions</h2>
                <div className="space-y-4">
                  {submissions.map((sub, index) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{sub.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          sub.status === "SUBMITTED" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Problem Statement ID:</strong> {sub.ps_id}
                      </p>
                      <p className="text-gray-700">{sub.abstract}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        Submitted on: {new Date(sub.created_at || Date.now()).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
