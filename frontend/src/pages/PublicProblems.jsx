import { useEffect, useState } from "react";
import api from "../services/api";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function PublicProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/public/ps");
        setProblems(res.data);
      } catch (err) {
        console.error("Failed to fetch problem statements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = problems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Explore <span className="text-green-500">Problem Statements</span>
        </h1>

        <input
          type="text"
          placeholder="🔍 Search problem statements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
        />

        {loading ? (
          <p className="text-center text-gray-500">Loading problem statements...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No problem statements found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg border-l-4 border-green-500"
              >
                <h2 className="font-semibold text-lg text-gray-800 mb-2">
                  {p.title}
                </h2>
                <p className="text-gray-600 text-sm mb-2">{p.description}</p>
                <p className="text-gray-500 text-xs">
                  Difficulty: <span className="font-semibold">{p.difficulty}</span>
                </p>
                <p
                  className={`text-sm mt-2 font-medium ${
                    p.status === "OPEN" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {p.status === "OPEN" ? "🟢 Open" : "🔴 Closed"}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
