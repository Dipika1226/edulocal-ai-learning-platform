import {
  BookOpen,
  CirclePlus,
  LayoutDashboard,
  NotebookPen,
  Puzzle
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Video Learning",
    to: "/dashboard",
    icon: BookOpen,
  },
  {
    label: "Quizzes",
    to: "/dashboard",
    icon: Puzzle,
  },
  {
    label: "My Notes",
    to: "/dashboard",
    icon: NotebookPen,
  },
  {
    label: "Upload Video",
    to: "/dashboard/upload",
    icon: CirclePlus,
  },
{
  label: "History",
  to: "/dashboard/history",
  icon: BookOpen,
}
];

export default function Sidebar() {
  return (
    <aside className="flex min-h-[calc(100vh-73px)] w-48 shrink-0 flex-col border-r border-purple-100 bg-white">
      <nav className="flex flex-1 flex-col px-2 py-6">
        <div className="space-y-2">
          {navItems.map(({ label, to, icon: Icon, active }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) => {
                const isCurrent = active ? isActive : false;

                return [
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isCurrent
                    ? "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-[0_8px_18px_rgba(147,51,234,0.22)]"
                    : "text-slate-700 hover:bg-purple-50 hover:text-purple-700",
                ].join(" ");
              }}
              end={active}
            >
              <Icon size={16} strokeWidth={2.1} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
