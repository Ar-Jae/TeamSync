import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BrushIcon from '@mui/icons-material/Brush';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 200;

const Sidebar = ({ onSelect, selected }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
    }}
  >
    <Toolbar />
    <Divider />
    <List>
      <ListItem component="button" selected={selected === 'profile'} onClick={() => onSelect('profile')}>
        <ListItemIcon><AccountCircleIcon /></ListItemIcon>
        <ListItemText primary="User Profile" />
      </ListItem>
      <ListItem component="button" selected={selected === 'kanban'} onClick={() => onSelect('kanban')}>
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Kanban Board" />
      </ListItem>
      <ListItem component="button" selected={selected === 'canvas'} onClick={() => onSelect('canvas')}>
        <ListItemIcon><BrushIcon /></ListItemIcon>
        <ListItemText primary="Canvas Board" />
      </ListItem>
      <ListItem component="button" selected={selected === 'ai'} onClick={() => onSelect('ai')}>
        <ListItemIcon><SmartToyIcon /></ListItemIcon>
        <ListItemText primary="AI Summarization" />
      </ListItem>
      <ListItem component="button" selected={selected === 'settings'} onClick={() => onSelect('settings')}>
        <ListItemIcon><SettingsIcon /></ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
    </List>
  </Drawer>
);

export default Sidebar;
