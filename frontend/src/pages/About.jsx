// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-gray-800 mb-6"
      >
        About <span className="text-green-500">Smart India Hackathon</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl text-gray-600 text-lg leading-relaxed text-center"
      >
        The <strong>Smart India Hackathon (SIH)</strong> is an initiative by the Government
        of India to promote innovation and problem-solving among students nationwide.
        This portal serves as a one-stop solution for participants, SPOCs, and admins
        to collaborate efficiently — from problem statement discovery to final submissions.
      </motion.p>

      <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-green-500"
        >
          <h3 className="font-semibold text-xl mb-2">🚀 Mission</h3>
          <p className="text-gray-600">
            Empower young innovators to solve real-world problems and build practical
            solutions that can impact industries and communities.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-green-500"
        >
          <h3 className="font-semibold text-xl mb-2">🤝 Collaboration</h3>
          <p className="text-gray-600">
            The portal connects institutions, SPOCs, team leaders, and administrators
            in one digital ecosystem for seamless communication.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-green-500"
        >
          <h3 className="font-semibold text-xl mb-2">🏆 Innovation</h3>
          <p className="text-gray-600">
            Encourages students to innovate, create, and present groundbreaking ideas
            addressing the nation’s most pressing challenges.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
