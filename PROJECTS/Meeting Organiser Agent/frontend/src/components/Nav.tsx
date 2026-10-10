import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";

export const Nav: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Meetings", path: "/meetings" },
    { label: "Actions", path: "/actions" },
    { label: "Trace", path: "/trace" },
  ];

  return (
    <header className="border-b border-rule bg-paper sticky top-0 z-10">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link to="/" className="font-serif text-xl tracking-tight text-ink flex items-baseline">
          Meeting Organizer<sup className="text-[10px] ml-0.5 font-sans">™</sup>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`label transition-colors duration-150 py-1 ${
                  isActive
                    ? "text-ink border-b-2 border-ink"
                    : "text-soft hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center space-x-4">
            <span className="label text-soft font-normal">
              {user.name} ({user.role})
            </span>
            <button
              onClick={logout}
              className="label text-soft hover:text-accent underline transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
