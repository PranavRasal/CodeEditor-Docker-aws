# 🚀 CodeEditor-Docker-AWS

A real-time collaborative online compiler. Multiple users edit code together (Monaco + Yjs), and code is compiled/executed sandboxed via the **Judge0 API** through a Node.js backend.

---

## ✨ Features

* 📝 **Monaco Editor** — VS Code-like editing experience
* 🤝 **Real-time collaboration** — Yjs CRDT over Socket.IO, works across devices
* ⚡ **Online compiler** — JavaScript, Python, Java, C++ executed by [Judge0](https://judge0.com) with CPU/memory limits
* 🐳 **Single-container deployment** — frontend build served by Express

## 🏗️ Architecture

```text
React (Vite + Monaco)
        │  same origin
        ▼
Node.js + Express  ──── Socket.IO / y-socket.io (editor sync)
        │
        ▼ POST /api/compile
     Judge0 API  (sandboxed compile + execute)
        │
        ▼ stdout / stderr / compile_output → React
```

## 📂 Project Structure

```bash
CodeEditor-Docker-aws/
├── Backend/          # Express server: static hosting, socket sync, Judge0 proxy
│   └── server.js
├── Frontend/         # React + Vite app (built into Backend/public for prod)
├── dockerfile        # Multi-stage: builds frontend, serves from backend
└── docker-compose.yml
```

## ⚙️ Local Development

From the project root:

```bash
npm install          # installs root tooling (concurrently)
npm run dev          # starts Backend :3000 and Frontend :5173 together
```

Open http://localhost:5173 — Vite proxies `/api` and `/socket.io` to the backend.

## 🔧 Environment Variables (Backend)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `JUDGE0_URL` | `https://ce.judge0.com` | Judge0 base URL |
| `JUDGE0_KEY` | – | RapidAPI key (if using hosted Judge0) |
| `JUDGE0_HOST` | – | RapidAPI host |
| `RATE_MAX` | `20` | Max compiles per IP per window |

> ⚠️ The free public instance (`ce.judge0.com`) is rate-limited and can be slow.
> For production use [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce) or self-host Judge0.

## 🐳 Docker Deployment

**One command (recommended):**

```bash
docker compose up -d --build
```

The app runs on port **80**. Set Judge0 credentials in a `.env` file next to `docker-compose.yml`:

```env
JUDGE0_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_KEY=your_rapidapi_key
JUDGE0_HOST=judge0-ce.p.rapidapi.com
APP_PORT=80
```

Or plain docker:

```bash
docker build -t codeeditor .
docker run -d --restart unless-stopped -p 80:3000 \
  -e JUDGE0_URL=https://judge0-ce.p.rapidapi.com \
  -e JUDGE0_KEY=<key> \
  -e JUDGE0_HOST=judge0-ce.p.rapidapi.com \
  codeeditor
```

## ☁️ AWS EC2 Deployment

1. Launch an Ubuntu EC2 instance; open ports **22** and **80** in the security group.
2. SSH in and install Docker:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   sudo usermod -aG docker $USER   # log out/in after
   ```
3. Clone the repo and start:
   ```bash
   git clone <your-repo-url> && cd CodeEditor-Docker-aws
   nano .env            # add JUDGE0_URL / JUDGE0_KEY / JUDGE0_HOST
   sudo docker compose up -d --build
   ```
4. Open `http://<EC2_PUBLIC_IP>/?username=yourname` — share the URL with anyone; editor sync works on every device.

**Behind Nginx / ALB:** enable WebSocket upgrade (`Upgrade`/`Connection` headers) so editor sync works through the proxy.

## 👨‍💻 Author

GitHub: https://github.com/PranavRasal/CodeEditor-Docker-aws
