import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

import AIControls from './components/AIControls';
import AuthProvider, { useAuth } from './components/AuthProvider';
import AuthForm from './components/AuthForm';


import KanbanBoard from './components/KanbanBoard';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CanvasBoard from './components/CanvasBoard';
import Profile from './components/Profile';
import { Box, Toolbar, Paper, Typography, useMediaQuery, Button, Tooltip, Grid, Divider, Fade } from '@mui/material';
import { Add, GroupAdd, HelpOutline } from '@mui/icons-material';







const MainApp = ({ user, onLogout }) => {
  const [selected, setSelected] = useState('kanban');
  const isMobile = useMediaQuery('(max-width:600px)');

  // Dashboard state
  const [dashboard, setDashboard] = useState([
    { label: 'Tasks', value: 0, color: 'primary.main' },
    { label: 'Team Members', value: 0, color: 'secondary.main' },
    { label: 'Active Boards', value: 0, color: 'success.main' },
    { label: 'AI Actions', value: 0, color: 'info.main' },
  ]);
  // New Task dialog state
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTaskValue, setNewTaskValue] = useState('');
  const kanbanRef = useRef();

  const handleOpenNewTask = () => setNewTaskOpen(true);
  const handleCloseNewTask = () => {
    setNewTaskOpen(false);
    setNewTaskValue('');
  };
  const handleSubmitNewTask = async () => {
    if (kanbanRef.current && newTaskValue.trim()) {
      await kanbanRef.current.addTaskFromParent(newTaskValue);
      handleCloseNewTask();
    }
  };
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const [tasksRes, usersRes, boardsRes] = await Promise.all([
          fetch('/api/tasks', { headers }),
          fetch('/api/users', { headers }),
          fetch('/api/documents', { headers }),
        ]);
        const [tasks, users, boards] = await Promise.all([
          tasksRes.json(),
          usersRes.json(),
          boardsRes.json(),
        ]);
        setDashboard([
          { label: 'Tasks', value: Array.isArray(tasks) ? tasks.length : 0, color: 'primary.main' },
          { label: 'Team Members', value: Array.isArray(users) ? users.length : 0, color: 'secondary.main' },
          { label: 'Active Boards', value: Array.isArray(boards) ? boards.length : 0, color: 'success.main' },
          { label: 'AI Actions', value: 0, color: 'info.main' }, // Placeholder
        ]);
      } catch (err) {
        // fallback to zeros
        setDashboard([
          { label: 'Tasks', value: 0, color: 'primary.main' },
          { label: 'Team Members', value: 0, color: 'secondary.main' },
          { label: 'Active Boards', value: 0, color: 'success.main' },
          { label: 'AI Actions', value: 0, color: 'info.main' },
        ]);
      }
    };
    fetchDashboard();
  }, []);
  // Animated background shapes (simple SVG waves)
  const AnimatedBg = () => (
    <Fade in timeout={1200}>
      <Box sx={{
        position: 'fixed',
        zIndex: 0,
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
          <path d="M0,200 Q720,400 1440,200 L1440,0 L0,0 Z" fill="#1976d2" fillOpacity="0.12"/>
          <path d="M0,400 Q720,600 1440,400 L1440,0 L0,0 Z" fill="#42a5f5" fillOpacity="0.10"/>
          <circle cx="1200" cy="700" r="180" fill="#1976d2" fillOpacity="0.07"/>
        </svg>
      </Box>
    </Fade>
  );

  // Personalized greeting
  const now = new Date();
  const greeting = (() => {
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();
  const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });


  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #e3f2fd 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <AnimatedBg />
      <Navbar user={user} onLogout={onLogout} />
      <Box sx={{ display: 'flex', flex: 1, flexDirection: isMobile ? 'column' : 'row', zIndex: 1 }}>
        <Sidebar selected={selected} onSelect={setSelected} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: isMobile ? 1 : 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Toolbar />
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              maxWidth: 1100,
              minHeight: 500,
              p: isMobile ? 1.5 : 4,
              mt: isMobile ? 1 : 3,
              mb: isMobile ? 1 : 3,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.97)',
              boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.15)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <img src="/logo.svg" alt="TeamSync Logo" style={{ width: 40, height: 40 }} />
              <Typography variant="h5" color="primary" fontWeight={700}>
                {greeting}, {user.name || user.email}!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                {dateStr}
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {dashboard.map((item, idx) => (
                <Grid item xs={6} sm={3} key={item.label}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: item.color, color: '#fff' }}>
                    <Typography variant="h6" fontWeight={700}>{item.value}</Typography>
                    <Typography variant="body2">{item.label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Tooltip title="Create a new task" arrow>
                <Button variant="contained" color="primary" startIcon={<Add />} sx={{ minWidth: 140 }} onClick={handleOpenNewTask}>
                  New Task
                </Button>
              </Tooltip>
              <Tooltip title="Invite a team member" arrow>
                <Button variant="outlined" color="secondary" startIcon={<GroupAdd />} sx={{ minWidth: 170 }}>
                  Invite Team
                </Button>
              </Tooltip>
              <Tooltip title="Get help or tips" arrow>
                <Button variant="text" color="info" startIcon={<HelpOutline />} sx={{ minWidth: 100 }}>
                  Help
                </Button>
              </Tooltip>
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* Onboarding hint */}
            <Fade in timeout={1200}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tip: Use the sidebar to switch between boards and features. Click "AI" to try smart suggestions!
              </Typography>
            </Fade>
            {selected === 'profile' && <Profile />}
            {selected === 'kanban' && <KanbanBoard ref={kanbanRef} />}
            {selected === 'canvas' && <CanvasBoard />}
            {selected === 'ai' && <AIControls />}
            {selected === 'settings' && <div>Settings coming soon...</div>}
            {/* New Task Dialog */}
            <Dialog open={newTaskOpen} onClose={handleCloseNewTask} maxWidth="xs" fullWidth>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Task Title"
                  type="text"
                  fullWidth
                  value={newTaskValue}
                  onChange={e => setNewTaskValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmitNewTask(); }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseNewTask}>Cancel</Button>
                <Button onClick={handleSubmitNewTask} variant="contained" disabled={!newTaskValue.trim()}>Add</Button>
              </DialogActions>
            </Dialog>
            <Divider sx={{ mt: 3, mb: 1 }} />
            {/* Footer */}
            <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 13, mt: 2 }}>
              &copy; {now.getFullYear()} TeamSync &mdash; <a href="https://github.com/Ar-Jae/TeamSync" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>GitHub</a> &bull; <a href="#" style={{ color: '#1976d2', textDecoration: 'none' }}>Privacy</a> &bull; <a href="#" style={{ color: '#1976d2', textDecoration: 'none' }}>Support</a>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
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
