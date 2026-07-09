import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Comparison from "./pages/Comparison";
import AIChat from "./pages/AIChat";
import StockCharts from "./pages/StockCharts";
import News from "./pages/News";
import Watchlist from "./pages/Watchlist";
import PortfolioSimulator from "./pages/PortfolioSimulator";
import LangGraphVisual from "./pages/LangGraphVisual";

function App() {
  const { token, user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <Routes>

      {/* Default */}
      <Route
        path="/"
        element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={token ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace /> : <Login />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={token ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace /> : <Register />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      {/* History */}
      <Route
        path="/history"
        element={token ? <History /> : <Navigate to="/login" replace />}
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={token ? <Profile /> : <Navigate to="/login" replace />}
      />

      {/* Comparison */}
      <Route
        path="/compare"
        element={token ? <Comparison /> : <Navigate to="/login" replace />}
      />

      {/* AI Chat */}
      <Route
        path="/chat"
        element={token ? <AIChat /> : <Navigate to="/login" replace />}
      />

      {/* Stock Charts */}
      <Route
        path="/charts"
        element={token ? <StockCharts /> : <Navigate to="/login" replace />}
      />

      {/* News */}
      <Route
        path="/news"
        element={token ? <News /> : <Navigate to="/login" replace />}
      />

      {/* Watchlist */}
      <Route
        path="/watchlist"
        element={token ? <Watchlist /> : <Navigate to="/login" replace />}
      />

      {/* Portfolio Simulator */}
      <Route
        path="/portfolio"
        element={token ? <PortfolioSimulator /> : <Navigate to="/login" replace />}
      />

      {/* LangGraph Visualization */}
      <Route
        path="/langgraph"
        element={token ? <LangGraphVisual /> : <Navigate to="/login" replace />}
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          token
            ? isAdmin
              ? <AdminDashboard />
              : <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

    </Routes>
  );
}

export default App;