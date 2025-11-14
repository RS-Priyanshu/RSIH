import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 text-white flex justify-between items-center px-8 py-4 shadow-lg">
      <Link to="/" className="font-bold text-2xl text-green-400 tracking-wide">
        SIH Portal
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-green-400">Home</Link>
        <Link to="/about" className="hover:text-green-400">About</Link>
        <Link to="/guidelines" className="hover:text-green-400">Guidelines</Link>
        <Link to="/problems" className="hover:text-green-400">
  Problems
</Link>

        <Link to="/spoc-registration" className="hover:text-green-400">SPOC Registration</Link>
        {!user ? (
          <Link to="/login" className="bg-green-500 px-4 py-2 rounded-lg font-semibold hover:bg-green-600">
            Login
          </Link>
        ) : (
          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
