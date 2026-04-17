import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        onToggleSidebar={() =>
          setIsSidebarCollapsed((previousState) => !previousState)
        }
      />

      <div className="flex">
        <Sidebar isCollapsed={isSidebarCollapsed} />

        <main className="min-w-0 flex-1 p-5 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
