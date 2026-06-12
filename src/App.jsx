import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/module5/Layout";

// Module 5 Pages
import Dashboard from "./pages/Dashboard";
import AssignPoints from "./pages/AssignPoints";
import PointsHistory from "./pages/PointsHistory";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";

// Module 1 Pages
import RequestFormPage from "./pages/RequestFormPage";
import ApprovalDashboard from "./pages/ApprovalDashboard";
import RequestDetails from "./pages/RequestDetails";
import Notifications from "./pages/Notifications";
import RequestHistory from "./pages/RequestHistory";

// Module 2 Pages
import CertificateDashboard from "./pages/CertificateDashboard";
import VerifyCertificate from "./pages/VerifyCertificate";
import GenerateCertificate from "./pages/GenerateCertificate";

// Module 3 Pages
import EventDashboard from "./pages/EventDashboard";
import EventAnalytics from "./pages/EventAnalytics";
import MyTeams from "./pages/MyTeams";
import TeamRegistration from "./pages/TeamRegistration";
import EventCreation from "./pages/EventCreation";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= MODULE 5 ================= */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/assign-points"
          element={
            <Layout>
              <AssignPoints />
            </Layout>
          }
        />

        <Route
          path="/points-history"
          element={
            <Layout>
              <PointsHistory />
            </Layout>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <Layout>
              <Leaderboard />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        {/* ================= MODULE 1 ================= */}
        <Route
          path="/request-form"
          element={
            <Layout>
              <RequestFormPage />
            </Layout>
          }
        />

        <Route
          path="/approvals"
          element={
            <Layout>
              <ApprovalDashboard />
            </Layout>
          }
        />

        <Route
          path="/request-history"
          element={
            <Layout>
              <RequestHistory />
            </Layout>
          }
        />

        <Route
          path="/notifications"
          element={
            <Layout>
              <Notifications />
            </Layout>
          }
        />

        <Route
          path="/request-details/:id"
          element={
            <Layout>
              <RequestDetails />
            </Layout>
          }
        />

        {/* ================= MODULE 2 ================= */}
        <Route
          path="/certificates"
          element={
            <Layout>
              <CertificateDashboard />
            </Layout>
          }
        />

        <Route
          path="/verify-certificate"
          element={
            <Layout>
              <VerifyCertificate />
            </Layout>
          }
        />

        <Route
          path="/generate-certificate"
          element={
            <Layout>
              <GenerateCertificate />
            </Layout>
          }
        />

        {/* ================= MODULE 3 ================= */}
        <Route
          path="/event-dashboard"
          element={
            <Layout>
              <EventDashboard />
            </Layout>
          }
        />

        <Route
          path="/event-analytics"
          element={
            <Layout>
              <EventAnalytics />
            </Layout>
          }
        />

        <Route
          path="/my-teams"
          element={
            <Layout>
              <MyTeams />
            </Layout>
          }
        />

        <Route
          path="/team-registration"
          element={
            <Layout>
              <TeamRegistration />
            </Layout>
          }
        />

        <Route
          path="/create-event"
          element={
            <Layout>
              <EventCreation />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;