import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import {
  Avatar,
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';


const AuthForm = () => {
  const { login, register, error, user, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      await login(form.email, form.password);
    } else {
      await register(form.name, form.email, form.password);
    }
    setLoading(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  if (user) {
    return (
      <Paper elevation={3} sx={{ p: 4, mt: 8, maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
        <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h6" gutterBottom>
          Welcome, {user.name || user.email}!
        </Typography>
        <Button variant="contained" color="primary" onClick={logout} fullWidth>
          Logout
        </Button>
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #e3f2fd 100%)',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', backdropFilter: 'blur(2px)', background: 'rgba(255,255,255,0.95)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <img src="/logo.svg" alt="TeamSync Logo" style={{ width: 64, height: 64, marginBottom: 8 }} />
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
            TeamSync
          </Typography>
        </Box>
        <Typography variant="h6" align="center" gutterBottom>
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {!isLogin && (
            <TextField
              margin="normal"
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoFocus
            />
          )}
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoFocus={isLogin}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end" aria-label="toggle password visibility">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 1 }}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
          <Button
            type="button"
            fullWidth
            variant="text"
            color="primary"
            onClick={() => setIsLogin(!isLogin)}
            sx={{ mb: 1 }}
          >
            {isLogin ? 'Need an account?' : 'Already have an account?'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthForm;
