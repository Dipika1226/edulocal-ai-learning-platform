import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import SignupStep2 from "./pages/auth/SignupStep2";
import DashboardHome from "./pages/dashboard/DashboardHome";
import History from "./pages/History";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
import Upload from "./pages/Upload";
import Watch from "./pages/Watch";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup-step2" element={<SignupStep2 />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="upload" element={<Upload />} />
        <Route path="history" element={<History />} />
        <Route path="watch" element={<Watch />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;