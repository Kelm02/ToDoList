// pages/login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      // On successful login, store the JWT token
      localStorage.setItem('token', response.data.token);

      // Redirect to the home or dashboard page
      router.push('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Login</h1>
      {error && <p style={styles.errorText}>{error}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
  },
  heading: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    alignItems: 'center',
  },
  input: {
    padding: '12px',
    margin: '10px 0',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#6c63ff',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  errorText: {
    color: 'red',
    marginBottom: '20px',
  },
};

export default LoginPage;
