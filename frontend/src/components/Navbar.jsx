import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          EduLocal
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">
            Home
          </Link>
          <Link to="/features" className="hover:text-indigo-600 transition">
            Features
          </Link>
          <Link to="/how-it-works" className="hover:text-indigo-600 transition">
            How It Works
          </Link>
          <Link to="/community" className="hover:text-indigo-600 transition">
            Community
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
