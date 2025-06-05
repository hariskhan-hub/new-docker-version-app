import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validation
    if (!username || !password) {
      setMessage('Username and password are required');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting to sign up with:', { username });
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        password
      });
      console.log('Signup response:', response.data);
      
      setMessage(response.data.message);
      if (response.data.message === 'User registered successfully') {
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        setMessage(error.response.data.message || 'Error during signup');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setMessage('No response from server. Please check if the backend is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        setMessage('Error setting up request: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={isLoading}
          style={{ 
            padding: '10px', 
            fontSize: '16px', 
            backgroundColor: isLoading ? '#cccccc' : '#4CAF50', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      {message && (
        <div style={{ 
          marginTop: '15px',
          padding: '10px', 
          backgroundColor: message.includes('successfully') ? '#e8f5e9' : '#ffebee',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to="/signin">Sign In</Link>
      </div>
    </div>
  );
}

export default SignUp;
