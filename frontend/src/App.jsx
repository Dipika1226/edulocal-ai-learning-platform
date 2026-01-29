import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<div className="p-6">Home Page</div>} />
        <Route path="/login" element={<div className="p-6">Login</div>} />
        <Route path="/signup" element={<div className="p-6">Signup</div>} />
      </Routes>
    </Router>
  );
}

export default App;
