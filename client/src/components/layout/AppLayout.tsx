// src/components/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import RightBar from "./RightSidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 ">

      {/* Top Bar */}
      <Navbar />

      <div className="flex max-w-6xl mx-auto pt-16">

        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 -mt-4 -ml-16">
          <Sidebar />
        </aside>

        {/* Main Feed */}
        <main className="flex-1 border-x border-gray-200 min-h-screen">
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-72">
          <RightBar />
        </aside>

      </div>
    </div>
  );
}