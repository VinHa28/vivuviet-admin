import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "./dashboard/AdminDashboard";
import Login from "./pages/Login";
import Partners from "./pages/Partners";
import Services from "./pages/Services";
import { getCurrentUser } from "./services/authService";
import Posts from "./pages/Posts";
import Destinations from "./pages/Destinations";
import Stats from "./pages/Stats";
import PartnerDetails from "./pages/PartnerDetails";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partners"
          element={
            <ProtectedRoute>
              <Partners />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partners/details/:id"
          element={
            <ProtectedRoute>
              <PartnerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        {/* Placeholder routes */}
        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/locations"
          element={
            <ProtectedRoute>
              <Destinations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
