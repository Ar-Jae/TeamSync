import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import './Home.css';

export default function Home() {
  const { user } = useAuth() || {};
  const displayName = user?.name || user?.username || 'Friend';
  const avatar = user?.avatar || '/default-avatar.png';

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <div>
            <h1>Welcome back, {displayName}</h1>
            <p className="lead">Quick links to pick up where you left off.</p>
          </div>
          <div className="home-avatar">
            <img src={avatar} alt="avatar" />
          </div>
        </div>

        <section className="home-actions">
          <NavLink className="home-card" to="/app/board">Open Kanban</NavLink>
          <NavLink className="home-card" to="/app/documents">Documents</NavLink>
          <NavLink className="home-card" to="/app/chat">Team Chat</NavLink>
          <NavLink className="home-card" to="/app/profile">Profile</NavLink>
        </section>

        <section className="home-grid">
          <div className="home-panel">
            <h3>Activity</h3>
            <ul className="recent-list">
              <li>Edited Document: Project Plan</li>
              <li>New Task: Design review</li>
              <li>Commented in Chat: Sprint retro notes</li>
            </ul>
          </div>

          <div className="home-panel">
            <h4>Summary</h4>
            <div className="summary-row">
              <div className="summary-item">
                <div className="summary-number">0</div>
                <div className="summary-label">Open Tasks</div>
              </div>
              <div className="summary-item">
                <div className="summary-number">0</div>
                <div className="summary-label">Active Boards</div>
              </div>
              <div className="summary-item">
                <div className="summary-number">8</div>
                <div className="summary-label">Open Tasks</div>
              </div>
              <div className="summary-item">
                <div className="summary-number">3</div>
                <div className="summary-label">Active Docs</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
