import {
  BookOpen,
  CirclePlus,
  History,
  LayoutDashboard,
  NotebookPen,
  Puzzle,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { getText } from "../utils/translations";

export default function Sidebar({ isCollapsed = false }) {
  const t = getText();

  const navItems = [
    {
      label: t.dashboard,
      to: "/dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    {
      label: t.videoLearning,
      to: "/dashboard",
      icon: BookOpen,
    },
    {
      label: t.quizzes,
      to: "/dashboard",
      icon: Puzzle,
    },
    {
      label: t.myNotes,
      to: "/dashboard",
      icon: NotebookPen,
    },
    {
      label: t.uploadVideo,
      to: "/dashboard/upload",
      icon: CirclePlus,
    },
    {
      label: t.history,
      to: "/dashboard/history",
      icon: History,
    },
  ];

  return (
    <aside
      className={`flex min-h-[calc(100vh-73px)] shrink-0 flex-col border-r border-purple-100 bg-white transition-all duration-300 ${
        isCollapsed ? "w-[76px]" : "w-56"
      }`}
    >
      <nav className="flex flex-1 flex-col px-2 py-6">
        <div className="space-y-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) => {
                return [
                  `flex items-center rounded-lg px-4 py-3 text-[14px] font-medium transition-all duration-200 ${
                    isCollapsed ? "justify-center" : "gap-3"
                  }`,
                  isActive
                    ? "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-[0_8px_18px_rgba(147,51,234,0.22)]"
                    : "text-slate-700 hover:bg-purple-50 hover:text-purple-700",
                ].join(" ");
              }}
              end={to === "/dashboard"}
            >
              <Icon size={16} strokeWidth={2.1} />
              {!isCollapsed ? <span>{label}</span> : null}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
