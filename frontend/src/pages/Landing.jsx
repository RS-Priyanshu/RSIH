import { Link } from "react-router-dom";
import hero from "../assets/alarm-clock-svgrepo-com.svg";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white relative overflow-hidden"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>
      
      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl px-6"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1
          className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Smart India Hackathon
        </motion.h1>
        <motion.p
          className="max-w-2xl mx-auto text-gray-300 text-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Submit your ideas, manage your teams, and revolutionize the future — all in one place.
        </motion.p>
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/spoc-registration"
            className="bg-green-500 px-8 py-4 text-lg rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Register as SPOC
          </Link>
          <Link
            to="/problems"
            className="bg-white text-gray-900 px-8 py-4 text-lg rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
          >
            View Problem Statements
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
