import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

import AIControls from './components/AIControls';
import AuthProvider, { useAuth } from './components/AuthProvider';
import AuthForm from './components/AuthForm';


import KanbanBoard from './components/KanbanBoard';
import TaskBoard from './components/TaskBoard';
import ChatView from './components/ChatView';
// ...existing code...
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import CanvasBoard from './components/CanvasBoard';
import Profile from './components/Profile';
import { Box } from '@mui/material';







const MainApp = ({ user, onLogout }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  // No useRef usage here
  return (
    <Router>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#f8fafc' }}>
        <TopBar onSettings={() => {}} />
        <Box sx={{ display: 'flex', flex: 1, flexDirection: isMobile ? 'column' : 'row' }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: isMobile ? 1 : 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/boards/kanban" replace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/boards/kanban" element={<KanbanBoard />} />
              <Route path="/boards/taskboard" element={<TaskBoard />} />
              <Route path="/boards/canvas" element={<CanvasBoard />} />
              <Route path="/tools/ai" element={<AIControls />} />
              <Route path="/chat" element={<ChatView />} />
              <Route path="/settings" element={<div>Settings coming soon...</div>} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
};


const App = () => {
  const { user, logout } = useAuth();
  return user ? <MainApp user={user} onLogout={logout} /> : <AuthForm />;
};

const AppWithProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithProvider;
