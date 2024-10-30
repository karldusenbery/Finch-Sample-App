// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

app.post('/api/sandbox/create', async (req, res) => { 
  try {
    const response = await fetch('https://finch-sandbox-se-interview.vercel.app/api/sandbox/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: req.body 
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sandbox provider' });
  }
});

app.post('/api/auth/token', async (req, res) => {
  try {
    const response = await fetch('https://finch-sandbox-se-interview.vercel.app/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: req.body
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

app.get('/api/auth', async (req, res) => {
  const provider = req.query.provider;
  try {
    const response = await fetch(`https://finch-sandbox-se-interview.vercel.app/api/auth?provider=${provider}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch access token' });
  }
});

app.get('/api/company', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  try {
    const response = await fetch('https://finch-sandbox-se-interview.vercel.app/api/company', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company info' });
  }
});

app.get('/api/directory', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  try {
    const response = await fetch('https://finch-sandbox-se-interview.vercel.app/api/directory', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee directory' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});