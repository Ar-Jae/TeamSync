import React, { useState } from 'react';

import AIControls from './components/AIControls';
import AuthProvider, { useAuth } from './components/AuthProvider';
import AuthForm from './components/AuthForm';

import KanbanBoard from './components/KanbanBoard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import CanvasBoard from './components/CanvasBoard';
import { Box, Toolbar } from '@mui/material';
import Profile from './components/Profile';






const MainApp = ({ user, onLogout }) => {
  const [selected, setSelected] = useState('kanban');
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <Box sx={{ display: 'flex' }}>
        <Sidebar selected={selected} onSelect={setSelected} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {selected === 'profile' && <Profile />}
          {selected === 'kanban' && <KanbanBoard />}
          {selected === 'canvas' && <CanvasBoard />}
          {selected === 'ai' && <AIControls />}
          {selected === 'settings' && <div>Settings coming soon...</div>}
        </Box>
      </Box>
    </>
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
