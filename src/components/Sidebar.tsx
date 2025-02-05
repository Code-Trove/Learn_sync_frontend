import React from "react";
import { FaHome, FaUser, FaCog } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-[#202123] text-gray-300 flex flex-col border-r border-gray-700">
      {/* Top section with New Chat button */}
      <div className="p-2">
        <button className="w-full py-3 px-3 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3">
          <span>+ New Chat</span>
        </button>
      </div>

      {/* Navigation section */}
      <nav className="flex-1 overflow-y-auto">
        <div className="px-2 py-2">
          <div className="text-xs text-gray-500 font-medium mb-2 px-3">Recent</div>
          <ul className="space-y-1">
            <SidebarItem to="/" icon={<FaHome />} label="Home" />
            <SidebarItem to="/profile" icon={<FaUser />} label="Profile" />
            <SidebarItem to="/settings" icon={<FaCog />} label="Settings" />
          </ul>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-700 p-2">
        <button className="w-full py-3 px-3 text-sm hover:bg-gray-700 rounded-md transition-colors duration-200 flex items-center gap-3">
          <FaUser className="text-gray-400" />
          <span>Your Account</span>
        </button>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label }) => (
  <li>
    <a
      href={to}
      className="flex items-center gap-3 px-3 py-3 text-sm rounded-md hover:bg-gray-700 transition-colors duration-200"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </a>
  </li>
);

export default Sidebar;
