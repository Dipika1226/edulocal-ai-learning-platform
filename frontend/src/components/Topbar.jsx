import { Bell, ChevronDown, LogOut, Menu, Settings, SquareLibrary } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onToggleSidebar }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        console.log("Topbar user fetch error:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    if (!isProfileOpen) return;

    const handlePointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileOpen]);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 text-violet-600">
          <SquareLibrary size={16} />
          <span className="text-xl font-bold">EduLocal</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-sm text-slate-600">
          🌐 {user?.preferredLanguage || "Not set"}
        </div>

        <button className="relative p-1.5 text-slate-600 hover:bg-slate-100 rounded-full">
          <Bell size={18} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full pr-1 hover:bg-slate-50"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-sm font-semibold text-white">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </span>

            <span className="hidden sm:inline text-sm text-slate-600">
              {user?.username || "User"}
            </span>

            <ChevronDown
              size={15}
              className={`transition ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-xl border bg-white shadow-lg z-20">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <p className="text-xs text-violet-600 mt-1">
                  Language: {user?.preferredLanguage || "Not set"}
                </p>
              </div>

              <div className="p-2">
                <button
  onClick={() => {
    setIsProfileOpen(false);
    navigate("/dashboard/settings");
  }}
  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
>
  <Settings size={16} />
  Settings
</button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
