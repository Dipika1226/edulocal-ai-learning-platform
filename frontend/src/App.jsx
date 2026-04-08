import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import SignupStep2 from "./pages/auth/SignupStep2";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup-step2" element={<SignupStep2 />} /> 
    </Routes>
  );
}

export default App;