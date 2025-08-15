import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import useDashboardData from '../utils/dashboard';
import { Avatar, Box, Grid, Card, CardContent, Typography, Button, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Tooltip, IconButton, TextField, Stack, Chip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import ChatIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonIcon from '@mui/icons-material/PersonOutline';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import './Home.css';

export default function Home() {
  const { user } = useAuth() || {};
  const { loading, error, summary } = useDashboardData();
  const displayName = user?.name || user?.firstName || 'Friend';
  const avatar = user?.avatar || '/default-avatar.png';

  const relativeTime = (when) => {
    if (!when) return '';
    const delta = Math.floor((Date.now() - new Date(when).getTime()) / 1000);
    if (delta < 60) return `${delta}s ago`;
    if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
    if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
    return `${Math.floor(delta / 86400)}d ago`;
  };

  return (
    <Box className="home-page">
      <Box className="home-container">
        <Grid container alignItems="center" spacing={2} className="header-grid">
          <Grid item xs={12} sm={9}>
            <Typography variant="h4" component="h1" gutterBottom>Welcome back, {displayName}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Quick links to pick up where you left off.</Typography>
          </Grid>
    <Grid item xs={12} sm={3} className="avatar-grid">
            <Avatar src={avatar} alt={displayName} sx={{ width: 64, height: 64 }} />
          </Grid>
        </Grid>

  <Grid container spacing={2} className="links-grid">
          <Grid item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent className="link-card-content">
                <DashboardIcon color="primary" />
                <Button component={NavLink} to="/app/board" variant="text">Open Kanban</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                <DescriptionIcon color="primary" />
                <Button component={NavLink} to="/app/documents" variant="text">Documents</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ChatIcon color="primary" />
                <Button component={NavLink} to="/app/chat" variant="text">Team Chat</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined">
              <CardContent sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                <PersonIcon color="primary" />
                <Button component={NavLink} to="/app/profile" variant="text">Profile</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick-create CTA row */}
        {/* Hero */}
        <Box className="home-hero" sx={{ mb: 3, p: 2, borderRadius: 2 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Stay focused, {displayName}.</Typography>
              <Typography variant="body2" color="text.secondary">Overview of your projects, tasks and documents.</Typography>
              <Box sx={{ mt: 2 }}>
                <TextField placeholder="Search tasks, docs, people..." fullWidth size="small" />
              </Box>
            </Grid>
              <Grid item xs={12} md={4} className="hero-cta-grid">
                <Stack direction="row" spacing={1} className="hero-cta-stack">
                <Button component={NavLink} to="/app/board" variant="contained" startIcon={<AddIcon />}>New Task</Button>
                <Button component={NavLink} to="/app/documents/new" variant="outlined">New Doc</Button>
              </Stack>
            </Grid>
          </Grid>
          </Box>

          {/* Stats row */}
          <Grid container spacing={2} className="home-stats-grid">
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent className="stat-card-content">
                <AssignmentIcon fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h6">{loading ? '—' : summary.tasks}</Typography>
                  <Typography variant="caption" color="text.secondary">Open tasks</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ArticleIcon fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h6">{loading ? '—' : summary.documents}</Typography>
                  <Typography variant="caption" color="text.secondary">Active documents</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PeopleIcon fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h6">Team</Typography>
                  <Typography variant="caption" color="text.secondary">Connect with teammates</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
  </Grid>

  {/* End hero/stats */}

        {/* Quick-create CTA row */}
        <Grid container spacing={2} className="quick-create-grid">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent className="quick-create-content">
                <Box>
                  <Typography variant="subtitle2">Quick create</Typography>
                  <Typography variant="body2" color="text.secondary">Create a task or document in seconds</Typography>
                </Box>
                <Box className="quick-create-actions">
                  <Tooltip title="New Task">
                    <IconButton component={NavLink} to="/app/board" color="primary"><AddIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="New Document">
                    <IconButton component={NavLink} to="/app/documents/new" color="primary"><AddIcon /></IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6">Recent activity</Typography>
                {loading ? (
                  <div className="loading-box"><CircularProgress size={28} /></div>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <List>
                    {summary.recent && summary.recent.length ? summary.recent.map((d, i) => {
                      const title = d.title || d.name || 'Untitled';
                      const when = d.updatedAt || d.createdAt || d.modifiedAt || null;
                      const dateText = when ? new Date(when).toLocaleString() : '';
                      const avatarUrl = d.owner?.avatar || d.avatar || null;
                      return (
                        <ListItem key={d._id || i} secondaryAction={<Typography variant="caption" color="text.secondary">{dateText}</Typography>}>
                          <ListItemAvatar>
                            <Avatar src={avatarUrl}>{!avatarUrl && (title[0] || 'D')}</Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={title} secondary={d.summary || d.description || ''} />
                        </ListItem>
                      );
                    }) : (
                      <ListItem>
                        <ListItemText primary="No recent activity yet" secondary="Create a task or document to get started." />
                      </ListItem>
                    )}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Summary</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography variant="h4">{loading ? '—' : summary.tasks}</Typography>
                    <Typography color="text.secondary">Open Tasks</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography variant="h4">{loading ? '—' : summary.documents}</Typography>
                    <Typography color="text.secondary">Active Documents</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
