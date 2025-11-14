import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Guidelines from "./pages/Guidelines";
import Login from "./pages/Login";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import SpocDashboard from "./pages/dashboard/SpocDashboard";
import TeamDashboard from "./pages/dashboard/TeamDashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";
import SpocRegistration from "./pages/SpocRegistration";
import PublicProblems from "./pages/PublicProblems";
import Navbar from "./components/NavBar";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/problems" element={<PublicProblems />} />
          <Route path="/login" element={<Login />} />
          <Route path="/spoc-registration" element={<SpocRegistration />} />

          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/spoc"
            element={
              <ProtectedRoute role="SPOC">
                <SpocDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/team"
            element={
              <ProtectedRoute role="TEAM_LEADER">
                <TeamDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
