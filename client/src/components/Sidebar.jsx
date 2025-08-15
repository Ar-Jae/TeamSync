

import React, { useState, useEffect } from "react";
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';
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
  const { user, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expanded, setExpanded] = useState(() => {
    try { return localStorage.getItem('sidebarExpanded') !== 'false'; } catch(e) { return true }
  });
  const [query, setQuery] = useState('');
  const handleToggle = () => setExpanded((prev) => !prev);
  useEffect(() => {
    try { localStorage.setItem('sidebarExpanded', expanded ? 'true' : 'false'); } catch(e) {}
  }, [expanded]);
  useEffect(() => {
    // Persist to server for logged-in users
    const persist = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        await fetch('/api/users/me', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ preferences: { sidebarExpanded: expanded } })
        });
    setToast({ open: true, message: 'Sidebar preference saved', severity: 'success' });
      } catch (e) {
    setToast({ open: true, message: 'Could not save preference', severity: 'warning' });
        // ignore network errors silently
      }
    };
    persist();
  }, [expanded]);

  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
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
        {expanded && <button className="sidebar-menu-btn" aria-hidden><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg></button>}
      </div>
      {/* Search */}
      <div className="sidebar-search-wrap" aria-hidden={!expanded}>
        <div className="sidebar-search" role="search">
          <MagnifyingGlassIcon className="icon" />
          {expanded ? (
            <input
              className="sidebar-search-input"
              placeholder="Search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search navigation"
            />
          ) : null}
        </div>
      </div>
      {/* Main Navigation */}
      <nav className="sidebar-nav" role="navigation" aria-label="Main">
        {mainNav.filter(item => item.name.toLowerCase().includes(query.toLowerCase())).map(({ name, key, icon: Icon, highlight }) => {
          // Map keys to route paths
          let to = "/";
          if (key === "home") to = "/home";
          else if (key === "dashboard") to = "/dashboard";
          else if (key === "projects") to = "/projects";
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
      <nav className="sidebar-nav sidebar-nav-lower" role="navigation" aria-label="Secondary">
        {lowerNav.filter(item => item.name.toLowerCase().includes(query.toLowerCase())).map(({ name, key, icon: Icon, badge }) => {
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
      <div className="sidebar-profile" aria-hidden={!expanded}>
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
        {expanded && <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button className="sidebar-logout" onClick={() => setConfirmOpen(true)} title="Log out">Log out</button>
          <button className="sidebar-profile-menu" aria-haspopup="true" aria-label="Profile menu"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button>
        </div>}
      <ConfirmDialog open={confirmOpen} title="Log out" message="Are you sure you want to log out?" onCancel={() => setConfirmOpen(false)} onConfirm={() => { setConfirmOpen(false); logout(); }} />
      </div>
  <Toast open={toast.open} onClose={() => setToast(t => ({ ...t, open: false }))} severity={toast.severity}>{toast.message}</Toast>
      
    </aside>
  );
}
