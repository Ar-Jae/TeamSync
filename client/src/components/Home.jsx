import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-container">
        <h1>Welcome to TeamSync</h1>
        <p className="lead">Collaborate on boards, chat in real-time, and manage tasks together.</p>

        <div className="home-links">
          <a className="home-card" href="/boards/kanban">Open Kanban</a>
          <a className="home-card" href="/boards/taskboard">Open TaskBoard</a>
          <a className="home-card" href="/chat">Open Chat</a>
          <a className="home-card" href="/tools/ai">AI Tools</a>
        </div>
      </div>
    </div>
  );
}
