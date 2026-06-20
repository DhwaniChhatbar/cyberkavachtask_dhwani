import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// LAYOUT
import Layout from "./components/module5/Layout";

// AUTH
import Login from "./pages/Login";
import Register from "./pages/Register";

// MODULE 5
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
import RequestHistoryPage from "./pages/RequestHistoryPage";

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

// MODULE 6
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";

// =========================
// AUTH HELPERS
// =========================
const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const PrivateRoute = ({ children }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// =========================
// APP
// =========================
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* MODULE 5 */}

        <Route
          path="/assign-points"
          element={
            <RoleRoute
              allowedRoles={[
                "Faculty Coordinator",
              ]}
            >
              <Layout>
                <AssignPoints />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/points-history"
          element={
            <RoleRoute
              allowedRoles={[
                "Faculty Coordinator",
                "Student Coordinator",
              ]}
            >
              <Layout>
                <PointsHistory />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <PrivateRoute>
              <Layout>
                <Leaderboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/badges"
          element={
            <PrivateRoute>
              <Layout>
                <Badges />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* MODULE 1 */}

        <Route
          path="/request-form"
          element={
            <PrivateRoute>
              <Layout>
                <RequestFormPage />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/approvals"
          element={
            <RoleRoute
              allowedRoles={[
                "Faculty Coordinator",
                "Student Coordinator",
                "Tech Coordinator",
                "Content Coordinator",
                "Social Media Coordinator",
              ]}
            >
              <Layout>
                <ApprovalDashboard />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/request-history"
          element={
            <PrivateRoute>
              <Layout>
                <RequestHistoryPage />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Layout>
                <Notifications />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/request-details/:id"
          element={
            <PrivateRoute>
              <Layout>
                <RequestDetails />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* MODULE 2 */}

        <Route
          path="/certificates"
          element={
            <RoleRoute
              allowedRoles={[
                "Faculty Coordinator",
                "Student Coordinator",
                "Member",
              ]}
            >
              <Layout>
                <CertificateDashboard />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/verify-certificate"
          element={
            <PrivateRoute>
              <Layout>
                <VerifyCertificate />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/generate-certificate"
          element={
            <RoleRoute
              allowedRoles={[
                "Faculty Coordinator",
                "Student Coordinator",
              ]}
            >
              <Layout>
                <GenerateCertificate />
              </Layout>
            </RoleRoute>
          }
        />

        {/* MODULE 3 */}

        <Route
          path="/event-dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <EventDashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/event-analytics"
          element={
            <PrivateRoute>
              <Layout>
                <EventAnalytics />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/my-teams"
          element={
            <PrivateRoute>
              <Layout>
                <MyTeams />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/team-registration"
          element={
            <PrivateRoute>
              <Layout>
                <TeamRegistration />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/create-event"
          element={
            <RoleRoute
              allowedRoles={[
                "Faculty Coordinator",
                "Student Coordinator",
                "Tech Coordinator",
              ]}
            >
              <Layout>
                <EventCreation />
              </Layout>
            </RoleRoute>
          }
        />

        {/* MODULE 6 */}

        <Route
          path="/analytics"
          element={
            <RoleRoute
              allowedRoles={[
                "Faculty Coordinator",
              ]}
            >
              <Layout>
                <Analytics />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <RoleRoute
              allowedRoles={[
                "Faculty Coordinator",
              ]}
            >
              <Layout>
                <Settings />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute
              allowedRoles={[
                "Faculty Coordinator",
              ]}
            >
              <Layout>
                <AdminPanel />
              </Layout>
            </RoleRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/register" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;