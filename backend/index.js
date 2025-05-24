const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = redis.createClient({ url: 'redis://localhost:6379' });

client.connect();

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  await client.hSet(`user:${username}`, { password });
  res.json({ message: 'User registered successfully' });
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const stored = await client.hGet(`user:${username}`, 'password');
  if (stored === password) res.json({ message: 'Login successful' });
  else res.json({ message: 'Invalid credentials' });
});

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});
