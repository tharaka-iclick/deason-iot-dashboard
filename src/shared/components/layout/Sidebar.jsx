import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings, Users, User } from "lucide-react";
// import "./Sidebar.css";

export const Sidebar = () => {
  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/devices", icon: Settings, label: "Devices" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
