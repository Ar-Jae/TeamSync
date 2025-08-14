import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Divider } from '@mui/material';


const Profile = ({ user }) => {
  const [profile, setProfile] = useState({ id: '', username: '', email: '', firstName: '', lastName: '', avatar: '', bio: '', createdAt: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/users/me', {
      credentials: 'include',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })
      .then(res => res.json())
      .then(data => {
        // Support both old 'name' and new 'firstName'/'lastName' fields
        setProfile({
          id: data.id || '',
          username: data.username || '',
          email: data.email || (user && user.email) || '',
          firstName: data.firstName || (data.name ? data.name.split(' ')[0] : ''),
          lastName: data.lastName || (data.name ? data.name.split(' ').slice(1).join(' ') : ''),
          avatar: data.avatar || (user && user.avatar) || '',
          bio: data.bio || '',
          createdAt: data.createdAt || ''
        });
        setLoading(false);
      })
      .catch(() => {
        setProfile({
          id: '',
          username: '',
          email: (user && user.email) || '',
          firstName: '',
          lastName: '',
          avatar: (user && user.avatar) || '',
          bio: '',
          createdAt: ''
        });
        setLoading(false);
      });
  }, [user]);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({
          ...profile,
          name: profile.firstName + (profile.lastName ? ' ' + profile.lastName : '')
        }),
      });
      const data = await res.json();
      if (res.ok) setSuccess('Profile updated!');
      else setError(data.error || 'Failed to update profile');
    } catch {
      setError('Failed to update profile');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, background: '#fff', borderRadius: 2, boxShadow: 1 }}>
      {user && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 80, height: 80, mb: 1 }}>
            {user.email ? user.email[0].toUpperCase() : '?'}
          </Avatar>
          <Typography variant="h6">{user.email}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            User Profile
          </Typography>
          <Divider sx={{ my: 2, width: '100%' }} />
        </Box>
      )}
      <Typography variant="h5" sx={{ mb: 2 }}>Edit Profile</Typography>
      <form onSubmit={handleSave}>
  {/* User ID and Username fields removed */}
        <label>Email:<br />
          <input name="email" value={profile.email} style={{ width: '100%' }} readOnly />
        </label>
        <br /><br />
        <label>First Name:<br />
          <input name="firstName" value={profile.firstName} onChange={handleChange} style={{ width: '100%' }} />
        </label>
        <br /><br />
        <label>Last Name:<br />
          <input name="lastName" value={profile.lastName} onChange={handleChange} style={{ width: '100%' }} />
        </label>
        <br /><br />
  {/* Avatar URL field removed */}
        <label>Bio:<br />
          <textarea name="bio" value={profile.bio} onChange={handleChange} style={{ width: '100%' }} />
        </label>
        <br /><br />
  {/* Created At field removed */}
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
      </form>
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {profile.avatar && (
        <div style={{ marginTop: 16 }}>
          <img src={profile.avatar} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%' }} />
        </div>
      )}
    </Box>
  );
};

export default Profile;
