import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import SignupStep2 from "./pages/auth/SignupStep2";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup-step2" element={<SignupStep2 />} /> 
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upload" element={<Upload />} />
    </Routes>
  );
}

export default App;