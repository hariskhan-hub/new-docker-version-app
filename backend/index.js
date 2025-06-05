const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Redis Configuration
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_URL = `redis://${REDIS_HOST}:${REDIS_PORT}`;

console.log('Connecting to Redis at:', REDIS_URL);

const client = redis.createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Retrying Redis connection... Attempt ${retries}`);
      return Math.min(retries * 100, 3000);
    }
  }
});

// Add error handling for Redis connection
client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis successfully!');
});

client.on('reconnecting', () => {
  console.log('Reconnecting to Redis...');
});

// Connect to Redis
(async () => {
  try {
    await client.connect();
    console.log('Redis connection established');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

// Health check endpoint
app.get('/health', (req, res) => {
  const healthy = client.isReady;
  res.json({ 
    status: healthy ? 'ok' : 'error',
    redis: healthy ? 'connected' : 'disconnected'
  });
});

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (!client.isReady) {
      return res.status(503).json({ message: 'Service unavailable: Redis not connected' });
    }

    // Check if user already exists
    const exists = await client.exists(`user:${username}`);
    if (exists) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    await client.hSet(`user:${username}`, { password });
    console.log(`User ${username} registered successfully`);
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Error during signup', 
      error: error.message,
      details: {
        redisConnected: client.isReady,
        errorName: error.name
      }
    });
  }
});

app.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (!client.isReady) {
      return res.status(503).json({ message: 'Service unavailable: Redis not connected' });
    }

    const stored = await client.hGet(`user:${username}`, 'password');
    if (stored === password) {
      console.log(`User ${username} logged in successfully`);
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ 
      message: 'Error during signin', 
      error: error.message,
      details: {
        redisConnected: client.isReady,
        errorName: error.name
      }
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: err.message 
  });
});

app.listen(5000, () => {
  console.log('Backend running on port 5000');
  console.log('Redis URL:', REDIS_URL);
});
