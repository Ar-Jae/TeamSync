

import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import { useAuth } from "./AuthProvider";
import './Sidebar.css';
import {
  HomeIcon,
  Squares2X2Icon,
  DocumentIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";


const mainNav = [
  { name: "Home", key: "home", icon: HomeIcon },
  { name: "Dashboard", key: "dashboard", icon: Squares2X2Icon },
  { name: "Projects", key: "projects", icon: DocumentIcon },
  { name: "TaskBoard", key: "taskboard", icon: ListBulletIcon, highlight: true },
  { name: "Chat", key: "chat", icon: ChatBubbleLeftRightIcon },
  { name: "Reporting", key: "reporting", icon: ChartBarIcon },
];

const lowerNav = [
  { name: "Notification", key: "notification", icon: BellIcon, badge: 2 },
  { name: "Support", key: "support", icon: QuestionMarkCircleIcon },
  { name: "Settings", key: "settings", icon: Cog6ToothIcon },
];



export default function Sidebar({ selected = "home", onSelect }) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const handleToggle = () => setExpanded((prev) => !prev);
  // For tooltip on collapsed
  const [hovered, setHovered] = useState(null);

  return (
    <aside className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}> 
      {/* Collapse/Expand Button */}
      <button
        className="sidebar-toggle"
        onClick={handleToggle}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {expanded ? (
          <ChevronDoubleLeftIcon className="icon" />
        ) : (
          <ChevronDoubleRightIcon className="icon" />
        )}
      </button>
      {/* Logo/Brand */}
      <div className="sidebar-logo">
        <span className="logo"><img src="/logo192.png" alt="logo" style={{width: 24, height: 24}} /></span>
        {expanded && <span className="sidebar-title">Untitled</span>}
        {expanded && <button className="sidebar-menu-btn"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg></button>}
      </div>
      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {mainNav.map(({ name, key, icon: Icon, highlight }) => {
          // Map keys to route paths
          let to = "/";
          if (key === "home") to = "/boards/kanban";
          else if (key === "dashboard") to = "/boards/kanban";
          else if (key === "projects") to = "/boards/kanban";
          else if (key === "taskboard") to = "/boards/taskboard";
          else if (key === "chat") to = "/chat";
          else if (key === "reporting") to = "/tools/ai";
          else to = `/${key}`;
          return (
            <div key={key} className="sidebar-nav-item">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `sidebar-btn${isActive ? ' active' : ''}${highlight ? ' highlight' : ''}`
                }
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                end={to === "/"}
              >
                <Icon className="icon" />
                {expanded && <span className="sidebar-btn-label">{name}</span>}
                {!expanded && hovered === key && (
                  <span className="sidebar-tooltip">{name}</span>
                )}
              </NavLink>
            </div>
          );
        })}
      </nav>
      <div className="sidebar-divider" />
      {/* Lower Navigation */}
      <nav className="sidebar-nav sidebar-nav-lower">
        {lowerNav.map(({ name, key, icon: Icon, badge }) => {
          const isActive = selected === key;
          return (
            <div key={key} className="sidebar-nav-item">
              <button
                className={`sidebar-btn${isActive ? ' active' : ''}`}
                onClick={() => onSelect && onSelect(key)}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
              >
                <Icon className="icon" />
                {badge && <span className="sidebar-badge">{badge}</span>}
                {expanded && <span className="sidebar-btn-label">{name}</span>}
                {!expanded && hovered === key && (
                  <span className="sidebar-tooltip">{name}</span> 
                )}
              </button>
            </div>
          );
        })}
      </nav>
      {/* User Profile */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar-wrap">
          <img src={user?.avatar || "/default-avatar.png"} alt="avatar" className="sidebar-avatar" />
          <span className="sidebar-avatar-online" style={{ display: user?.online !== false ? undefined : 'none' }} />
        </div>
        {expanded && user && (
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">{user.name || user.firstName || user.email}</div>
            <div className="sidebar-profile-email">{user.email}</div>
          </div>
        )}
        {expanded && <button className="sidebar-profile-menu"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button>}
      </div>
    </aside>
  );
}
