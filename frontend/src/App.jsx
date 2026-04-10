import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import SignupStep2 from "./pages/auth/SignupStep2";
import DashboardHome from "./pages/dashboard/DashboardHome";
import History from "./pages/History";
import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Watch from "./pages/Watch";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup-step2" element={<SignupStep2 />} />
      {/* <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upload" element={<Upload />} /> */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="upload" element={<Upload />} />
        <Route path="history" element={<History />} />
        <Route path="watch" element={<Watch />} />
      </Route>
    </Routes>
  );
}

export default App;
