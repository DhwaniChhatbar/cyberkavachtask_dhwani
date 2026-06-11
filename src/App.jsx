import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/module5/Layout";

import Dashboard from "./pages/Dashboard";
import AssignPoints from "./pages/AssignPoints";
import PointsHistory from "./pages/PointsHistory";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;