import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signin', {
        username,
        password
      });
      setMessage(response.data.message);
      if (response.data.message === 'Login successful') {
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error during signin');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Sign In</h1>
      <form onSubmit={handleSignin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <button 
          type="submit"
          style={{ 
            padding: '10px', 
            fontSize: '16px', 
            backgroundColor: '#2196F3', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign In
        </button>
      </form>
      {message && (
        <div style={{ 
          marginTop: '15px',
          padding: '10px', 
          backgroundColor: message.includes('successful') ? '#e8f5e9' : '#ffebee',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default SignIn;
