const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3456;

const API_KEY = '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';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Proxy route
app.post('/api/chat', async (req, res) => {
  try {
    let currentKey = API_KEY;
    if (req.body.model === 'google/gemma-4-31b-it') {
      currentKey = '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';
    }

    const upstream = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentKey}`,
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(req.body)
    });

    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}));
      return res.status(upstream.status).json({ error: err.message || `HTTP ${upstream.status}` });
    }

    // Stream back
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    upstream.body.on('data', chunk => res.write(chunk));
    upstream.body.on('end', () => res.end());
    upstream.body.on('error', err => { console.error(err); res.end(); });

  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/run', (req, res) => {
  exec(req.body.command, { cwd: require('os').homedir() }, (error, stdout, stderr) => {
    res.json({ output: stdout || stderr || (error ? error.message : "Success") });
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(`\n❌ Failed to start server: ${err.message}`);
    process.exit(1);
  }
  console.log(`\n✅  NEXUS server running at → http://localhost:${PORT}`);
  console.log(`   Open http://localhost:${PORT} in your browser\n`);
});
