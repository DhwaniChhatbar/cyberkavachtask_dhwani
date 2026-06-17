import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// LAYOUT
import Layout from "./components/module5/Layout";

// AUTH
import Login from "./pages/Login";
import Register from "./pages/Register";

// MODULE 5 (MAIN DASHBOARD SYSTEM)
import Dashboard from "./pages/Dashboard";
import AssignPoints from "./pages/AssignPoints";
import PointsHistory from "./pages/PointsHistory";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Badges from "./components/module5/Badges";

// MODULE 1
import RequestFormPage from "./pages/RequestFormPage";
import ApprovalDashboard from "./pages/ApprovalDashboard";
import RequestDetails from "./pages/RequestDetails";
import Notifications from "./pages/Notifications";
import RequestHistory from "./pages/RequestHistory";

// MODULE 2
import CertificateDashboard from "./pages/CertificateDashboard";
import VerifyCertificate from "./pages/VerifyCertificate";
import GenerateCertificate from "./pages/GenerateCertificate";

// MODULE 3
import EventDashboard from "./pages/EventDashboard";
import EventAnalytics from "./pages/EventAnalytics";
import MyTeams from "./pages/MyTeams";
import TeamRegistration from "./pages/TeamRegistration";
import EventCreation from "./pages/EventCreation";

// MODULE 6 (CORE ONLY)
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* MODULE 5 */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/assign-points" element={<Layout><AssignPoints /></Layout>} />
        <Route path="/points-history" element={<Layout><PointsHistory /></Layout>} />
        <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/badges" element={<Layout><Badges /></Layout>} />

        {/* MODULE 1 */}
        <Route path="/request-form" element={<Layout><RequestFormPage /></Layout>} />
        <Route path="/approvals" element={<Layout><ApprovalDashboard /></Layout>} />
        <Route path="/request-history" element={<Layout><RequestHistory /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/request-details/:id" element={<Layout><RequestDetails /></Layout>} />

        {/* MODULE 2 */}
        <Route path="/certificates" element={<Layout><CertificateDashboard /></Layout>} />
        <Route path="/verify-certificate" element={<Layout><VerifyCertificate /></Layout>} />
        <Route path="/generate-certificate" element={<Layout><GenerateCertificate /></Layout>} />

        {/* MODULE 3 */}
        <Route path="/event-dashboard" element={<Layout><EventDashboard /></Layout>} />
        <Route path="/event-analytics" element={<Layout><EventAnalytics /></Layout>} />
        <Route path="/my-teams" element={<Layout><MyTeams /></Layout>} />
        <Route path="/team-registration" element={<Layout><TeamRegistration /></Layout>} />
        <Route path="/create-event" element={<Layout><EventCreation /></Layout>} />

        {/* MODULE 6 */}
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;