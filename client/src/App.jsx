import React, { useState } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Outlet, Navigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

import AIControls from './components/AIControls';
import AuthProvider, { useAuth } from './components/AuthProvider';
import AuthForm from './components/AuthForm';
import Home from './components/Home';


import KanbanBoard from './components/KanbanBoard';
import TaskBoard from './components/TaskBoard';
import ChatView from './components/ChatView';
import Projects from './components/Projects';
// ...existing code...
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import CanvasBoard from './components/CanvasBoard';
import Profile from './components/Profile';
import { Box } from '@mui/material';







const RootLayout = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#f8fafc' }}>
      <TopBar onSettings={() => {}} />
      <Box sx={{ display: 'flex', flex: 1, flexDirection: isMobile ? 'column' : 'row' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: isMobile ? 1 : 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

// Router definition with v7_relativeSplatPath future flag enabled
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route index element={<Home />} />
  <Route path="home" element={<Home />} />
  <Route path="dashboard" element={<Home />} />
      <Route path="profile" element={<Profile />} />
      <Route path="boards/kanban" element={<KanbanBoard />} />
  <Route path="projects" element={<Projects />} />
      <Route path="boards/taskboard" element={<TaskBoard />} />
      <Route path="boards/canvas" element={<CanvasBoard />} />
      <Route path="tools/ai" element={<AIControls />} />
      <Route path="chat" element={<ChatView />} />
      <Route path="settings" element={<div>Settings coming soon...</div>} />
    </Route>
  ),
  {
    future: { v7_relativeSplatPath: true, v7_startTransition: true }
  }
);


const App = () => {
  const { user } = useAuth();
  return user ? <RouterProvider router={router} /> : <AuthForm />;
};

const AppWithProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithProvider;
