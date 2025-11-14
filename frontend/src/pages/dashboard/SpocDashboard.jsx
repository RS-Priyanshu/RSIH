import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function SpocDashboard() {
  const [teams, setTeams] = useState([]);
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTeamForm, setShowTeamForm] = useState(false);
  
  const [teamForm, setTeamForm] = useState({
    teamName: "",
    leaderName: "",
    leaderEmail: "",
    leaderPassword: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsRes, collegeRes] = await Promise.all([
        api.get("/api/spoc/teams"),
        api.get("/api/spoc/college")
      ]);
      setTeams(teamsRes.data);
      setCollege(collegeRes.data);
    } catch (err) {
      toast.error("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterTeam = async (e) => {
    e.preventDefault();
    try {
      if (!college) {
        toast.error("College information not found");
        return;
      }
      
      await api.post("/api/spoc/team", {
        ...teamForm,
        collegeId: college.id
      });
      toast.success("Team registered successfully!");
      setShowTeamForm(false);
      setTeamForm({
        teamName: "",
        leaderName: "",
        leaderEmail: "",
        leaderPassword: ""
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to register team");
    }
  };

  const checkSubmission = async (teamId) => {
    try {
      const res = await api.get(`/api/spoc/team/${teamId}/submission`);
      if (res.data.submitted) {
        toast.info(`Team has submitted: ${res.data.submission.title}`);
      } else {
        toast.info("Team has not submitted yet");
      }
    } catch (err) {
      toast.error("Failed to check submission");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800 mb-2"
        >
          SPOC Dashboard
        </motion.h1>
        
        {college && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 mb-6"
          >
            Institution: <span className="font-semibold text-green-600">{college.name}</span>
          </motion.p>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Registered Teams</h2>
          <button
            onClick={() => setShowTeamForm(!showTeamForm)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
          >
            {showTeamForm ? "Cancel" : "+ Register New Team"}
          </button>
        </div>

        {showTeamForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleRegisterTeam}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <h3 className="text-xl font-semibold mb-4">Register New Team</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Team Name *</label>
                <input
                  type="text"
                  value={teamForm.teamName}
                  onChange={(e) => setTeamForm({ ...teamForm, teamName: e.target.value })}
                  className="input"
                  placeholder="Enter team name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Team Leader Name *</label>
                <input
                  type="text"
                  value={teamForm.leaderName}
                  onChange={(e) => setTeamForm({ ...teamForm, leaderName: e.target.value })}
                  className="input"
                  placeholder="Enter leader name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Team Leader Email *</label>
                <input
                  type="email"
                  value={teamForm.leaderEmail}
                  onChange={(e) => setTeamForm({ ...teamForm, leaderEmail: e.target.value })}
                  className="input"
                  placeholder="Enter leader email"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Team Leader Password *</label>
                <input
                  type="password"
                  value={teamForm.leaderPassword}
                  onChange={(e) => setTeamForm({ ...teamForm, leaderPassword: e.target.value })}
                  className="input"
                  placeholder="Set password for team leader"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Register Team
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading teams...</div>
        ) : teams.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg mb-4">No teams registered yet.</p>
            <p className="text-gray-500">Click "Register New Team" to add your first team.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{team.name}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600 text-sm">
                    <strong>Leader:</strong> {team.leader_name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <strong>Email:</strong> {team.leader_email}
                  </p>
                </div>
                <button
                  onClick={() => checkSubmission(team.id)}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium"
                >
                  Check Submission Status
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        {teams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{teams.length}</p>
                <p className="text-gray-600 text-sm mt-1">Total Teams</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{college?.name || "N/A"}</p>
                <p className="text-gray-600 text-sm mt-1">Institution</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">Active</p>
                <p className="text-gray-600 text-sm mt-1">Status</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
