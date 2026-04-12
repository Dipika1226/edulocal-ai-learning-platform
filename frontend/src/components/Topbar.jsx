import { Bell, ChevronDown, LogOut, Menu, Settings, SquareLibrary } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
}
  useEffect(() => {
    if (!isProfileOpen) {
      return undefined;
    }

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
          className="rounded-md p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Open navigation"
        >
          <Menu size={18} strokeWidth={2.2} />
        </button>

        <div className="flex items-center gap-2 text-violet-600">
          <SquareLibrary size={16} strokeWidth={2.2} />
          <span className="text-xl font-bold tracking-tight">EduLocal</span>
        </div>
      </div>

      <div ref={profileMenuRef} className="relative flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-full p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={2.1} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full pr-1 text-left transition hover:bg-slate-50"
          aria-label="Learner profile"
          aria-expanded={isProfileOpen}
          onClick={() => setIsProfileOpen((open) => !open)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-sm font-semibold text-white">
            U
          </span>
          <span className="hidden text-sm font-medium text-slate-600 sm:inline">
            Learner
          </span>
          <ChevronDown
            size={15}
            strokeWidth={2.2}
            className={`hidden text-slate-500 transition-transform sm:inline ${
              isProfileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isProfileOpen ? (
          <div className="absolute right-4 top-[4.5rem] z-20 w-52 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_18px_40px_rgba(139,92,246,0.16)] sm:right-6">
            <div className="bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 text-white">
              <p className="text-sm font-semibold">Learner Account</p>
              <p className="text-xs text-white/80">Manage your preferences</p>
            </div>

            <div className="p-2">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                onClick={() => setIsProfileOpen(false)}
              >
                <Settings size={16} strokeWidth={2} />
                <span>Settings</span>
              </button>

              <button
                type="button"
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700"
                onClick={handleLogout}
              >
                <LogOut size={16} strokeWidth={2} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
