// src/components/layout/Sidebar.tsx
import { Home, User, Bell, Settings, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Notifications", icon: Bell, path: "/notifications" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  return (
    <div className="h-screen w-64 border-r bg-white p-4 flex flex-col">
      
      {/* Logo */}
      <div className="text-2xl font-bold mb-8">
        SocialApp
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-4 border-t">
        <button className="flex items-center gap-2 w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}