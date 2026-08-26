import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import { YSocketIO } from "y-socket.io/dist/server"
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

// Judge0 configuration (self-hosted, ce.judge0.com, or RapidAPI)
const JUDGE0_URL = process.env.JUDGE0_URL || 'https://ce.judge0.com';

function judge0Headers() {
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.JUDGE0_KEY && process.env.JUDGE0_HOST) {
    headers['X-RapidAPI-Key'] = process.env.JUDGE0_KEY;
    headers['X-RapidAPI-Host'] = process.env.JUDGE0_HOST;
  }
  return headers;
}

// Simple in-memory rate limiter for /api/compile (per IP)
const RATE_WINDOW_MS = Number(process.env.RATE_WINDOW_MS) || 60_000;
const RATE_MAX = Number(process.env.RATE_MAX) || 20;
const hits = new Map();

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of hits) {
    if (now - entry.start > RATE_WINDOW_MS) hits.delete(ip);
  }
}, RATE_WINDOW_MS);
cleanupTimer.unref();

function rateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  let entry = hits.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    entry = { start: now, count: 0 };
    hits.set(ip, entry);
  }
  entry.count += 1;
  if (entry.count > RATE_MAX) {
    return res.status(429).json({ message: 'Too many requests, please slow down.' });
  }
  next();
}

app.post('/api/compile', rateLimit, async (req, res) => {
  const { source_code, language_id, stdin } = req.body || {};

  if (!source_code || !language_id) {
    return res.status(400).json({
      message: 'source_code and language_id are required',
    });
  }

  try {
    const url = `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`;
    const response = await fetch(url, {
      method: 'POST',
      headers: judge0Headers(),
      body: JSON.stringify({
        source_code,
        language_id: Number(language_id),
        stdin: stdin ?? '',
        cpu_time_limit: 5,
        memory_limit: 128000,
      }),
      signal: AbortSignal.timeout(20000),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Judge0 error:', error.message);
    return res.status(502).json({
      message: 'Failed to reach Judge0 execution service',
    });
  }
});

app.get('/api/languages', async (req, res) => {
  try {
    const response = await fetch(`${JUDGE0_URL}/languages`, {
      headers: judge0Headers(),
      signal: AbortSignal.timeout(10000),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Judge0 error:', error.message);
    return res.status(502).json({
      message: 'Failed to reach Judge0 execution service',
    });
  }
});

app.get('/health' , (req , res)=>{
    res.status(200).json({
        message : "ok",
        success : true
    })
})

// SPA fallback for any other GET request
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/socket.io')) {
    return res.sendFile(path.join(publicDir, 'index.html'));
  }
  next();
});

const httpServer = createServer(app);

const io = new Server(httpServer ,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const ySocketIO = new YSocketIO(io);
ySocketIO.initialize();

const port = process.env.PORT || 3000;

httpServer.listen(port ,()=>{
    console.log(`Server is running on port ${port}`);
})

// Graceful shutdown (SIGTERM from docker stop / orchestrators)
function shutdown() {
  console.log('Shutting down gracefully...');
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
