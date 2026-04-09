import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useActiveSection from "../hooks/useActiveSection";
import useNavbarTheme from "../hooks/useNavbarTheme";

export default function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const [isOpen, setIsOpen] = useState(false);

  const activeSection = useActiveSection(
    isLanding ? ["features", "how-it-works", "community"] : [],
  );

  const isScrolled = useNavbarTheme(80);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <RouterLink
            to="/"
            className={`text-xl font-bold transition-colors bg-transparent outline-none ring-0 focus:outline-none focus:ring-0
    ${isScrolled ? "text-purple-700" : "text-white"}
  `}
          >
            EduLocal
          </RouterLink>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isLanding && (
              <>
                {[
                  { label: "Features", id: "features" },
                  { label: "How It Works", id: "how-it-works" },
                  { label: "Community", id: "community" },
                ].map((item) => (
                  <ScrollLink
                    key={item.id}
                    to={item.id}
                    smooth
                    offset={-80}
                    duration={500}
                    onClick={() => setIsOpen(false)}
                    className={`relative cursor-pointer text-sm font-medium transition-colors
                      ${
                        isScrolled
                          ? "text-gray-700 hover:text-purple-700"
                          : "text-white/80 hover:text-white"
                      }
                    `}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <span
                        className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full
                          ${isScrolled ? "bg-purple-600" : "bg-purple-300"}
                        `}
                      />
                    )}
                  </ScrollLink>
                ))}
              </>
            )}

            {/* Login → Route */}
            <RouterLink
              to="/login"
              className={`text-sm font-medium transition-colors
                ${
                  isScrolled
                    ? "text-gray-700 hover:text-purple-700"
                    : "text-white/80 hover:text-white"
                }`}
              onClick={() => setIsOpen(false)}
            >
              Login
            </RouterLink>
          </div>

          {/* Get Started → Signup */}
          <RouterLink
            to="/signup"
            className={`hidden md:inline-flex px-5 py-2 rounded-full text-sm font-semibold transition-all
              ${
                isScrolled
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-white text-purple-700 hover:bg-purple-100"
              }`}
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </RouterLink>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`md:hidden p-2 rounded-lg transition
              ${isScrolled ? "text-purple-700 hover:bg-purple-100" : "text-white hover:bg-white/10"}`}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-4 pt-2 flex flex-col gap-3">
            {isLanding &&
              [
                { label: "Features", id: "features" },
                { label: "How It Works", id: "how-it-works" },
                { label: "Community", id: "community" },
              ].map((item) => (
                <ScrollLink
                  key={item.id}
                  to={item.id}
                  smooth
                  offset={-80}
                  duration={500}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    isScrolled
                      ? "text-gray-700 hover:text-purple-700"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                </ScrollLink>
              ))}

            <RouterLink
              to="/login"
              onClick={() => setIsOpen(false)}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-purple-700"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Login
            </RouterLink>

            <RouterLink
              to="/signup"
              onClick={() => setIsOpen(false)}
              className={`inline-flex w-fit px-4 py-2 rounded-full text-sm font-semibold transition-all
                ${
                  isScrolled
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-white text-purple-700 hover:bg-purple-100"
                }`}
            >
              Get Started
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
