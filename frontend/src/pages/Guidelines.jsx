// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Guidelines() {
  const steps = [
    {
      title: "Step 1: SPOC Registration",
      desc: "Each institution must nominate one SPOC (Single Point of Contact) who will register through this portal and await admin verification.",
    },
    {
      title: "Step 2: Team Formation",
      desc: "After SPOC verification, the SPOC can register multiple teams from the same institution. Each team will have a Team Leader account.",
    },
    {
      title: "Step 3: Problem Statement Selection",
      desc: "Team Leaders can view available problem statements and select one that aligns with their expertise and interest.",
    },
    {
      title: "Step 4: Idea Submission",
      desc: "Once a problem is selected, the team leader can upload their idea details and supporting documents before the deadline.",
    },
    {
      title: "Step 5: Evaluation",
      desc: "Admins review all submissions and shortlist teams based on innovation, feasibility, and impact.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-gray-800 mb-8"
      >
        Participation <span className="text-green-500">Guidelines</span>
      </motion.h1>

      <div className="max-w-4xl w-full space-y-6">
        {steps.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{s.title}</h3>
            <p className="text-gray-600">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
