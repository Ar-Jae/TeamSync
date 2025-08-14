import React, { useState } from 'react';
import { useAuth } from './AuthProvider';

const AuthForm = () => {
  const { login, register, error, user, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isLogin) {
      login(form.email, form.password);
    } else {
      register(form.name, form.email, form.password);
    }
  };

  if (user) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div>Welcome, {user.name || user.email}!</div>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <h3>{isLogin ? 'Login' : 'Register'}</h3>
      {!isLogin && (
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      )}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ marginLeft: 8 }}>
        {isLogin ? 'Need an account?' : 'Already have an account?'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default AuthForm;
