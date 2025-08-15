import React from "react";
import './TopBar.css';
import { BellIcon, Cog6ToothIcon, MagnifyingGlassIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "./AuthProvider";
import ConfirmDialog from './ConfirmDialog';

export default function TopBar({ onSettings }) {
  const { user, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-title">TeamSync</span>
        <div className="topbar-search">
          <MagnifyingGlassIcon className="topbar-icon" />
          <input className="topbar-search-input" placeholder="Search..." />
        </div>
      </div>
      <div className="topbar-right">
        <button className="topbar-btn" aria-label="Notifications">
          <BellIcon className="topbar-icon" />
          <span className="topbar-badge">2</span>
        </button>
        <button className="topbar-btn" aria-label="Settings" onClick={onSettings}>
          <Cog6ToothIcon className="topbar-icon" />
        </button>
        <button className="topbar-btn" aria-label="Logout" onClick={() => setConfirmOpen(true)} title="Log out">
          <ArrowRightOnRectangleIcon className="topbar-icon" />
        </button>
        <div className="topbar-profile">
          <img src={user?.avatar || "/default-avatar.png"} alt="avatar" className="topbar-avatar" />
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Log out"
        message="Are you sure you want to log out?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); logout(); }}
      />
    </header>
  );
}
