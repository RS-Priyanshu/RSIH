import { useEffect, useState } from "react";
import api from "../services/api";

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
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          Problem Statements
        </h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search problem statements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-black"
        />

        {/* Table */}
        {loading ? (
          <p className="text-center text-gray-600">Loading problem statements...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-600">No problem statements found.</p>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full text-left bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 font-semibold">PS ID</th>
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-200 hover:bg-blue-50 transition"
                  >
                    <td className="py-3 px-4 text-black">{idx + 1}</td>

                    <td className="py-3 px-4 font-semibold text-black max-w-[250px]">
                      {p.title}
                    </td>

                    <td className="py-3 px-4 text-gray-700 max-w-[350px] truncate">
                      {p.description}
                    </td>

                    <td className="py-3 px-4 text-black">
                      {p.type || "N/A"}
                    </td>

                    <td className="py-3 px-4 text-black font-medium">
                      {p.category || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
