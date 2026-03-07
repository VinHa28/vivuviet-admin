import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  Briefcase,
  MapPin,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";
import { logout } from "../services/authService";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "home", name: "Tổng quan", icon: <Home size={20} />, path: "/" },
    {
      id: "partners",
      name: "Đối tác",
      icon: <Users size={20} />,
      path: "/partners",
    },
    {
      id: "services",
      name: "Dịch vụ",
      icon: <Briefcase size={20} />,
      path: "/services",
    },
    {
      id: "posts",
      name: "Bài đăng",
      icon: <FileText size={20} />,
      path: "/posts",
    },
    {
      id: "locations",
      name: "Địa điểm",
      icon: <MapPin size={20} />,
      path: "/locations",
    },
    {
      id: "stats",
      name: "Thống kê",
      icon: <BarChart2 size={20} />,
      path: "/stats",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-white flex flex-col p-6 border-r border-gray-100 shadow-sm fixed left-0">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-[#a5190e] rounded-md flex items-center justify-center text-white font-bold">
          T
        </div>
        <span className="text-2xl font-bold text-[#252525]">TravelAdmin</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-[#a5190e] text-white shadow-lg"
                  : "text-[#848484] hover:bg-[#f7bd01] hover:text-[#a5190e]"
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-4 px-4 py-3 text-[#848484] hover:text-[#a5190e] transition-colors mt-auto"
      >
        <LogOut size={20} />
        <span className="font-medium text-sm">Đăng xuất</span>
      </button>
    </div>
  );
};

export default Sidebar;
