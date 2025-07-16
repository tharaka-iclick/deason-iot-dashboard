import React from "react";
import { useSelector } from "react-redux";
import { Bell, User } from "lucide-react";
// import "./Header.css";

export const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">Deason IoT Dashboard</h1>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <Bell size={20} />
        </button>

        <div className="user-info">
          <User size={20} />
          <span>{user?.displayName}</span>
        </div>
      </div>
    </header>
  );
};
