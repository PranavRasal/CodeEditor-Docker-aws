# 🚀 CodeEditor-Docker-AWS

A real-time collaborative code editor that enables multiple users to write and edit code simultaneously. The platform leverages **Monaco Editor** for an IDE-like coding experience, **Yjs** for real-time synchronization, **Docker** for secure code execution, and **AWS** for scalable cloud deployment.

---

## ✨ Features

* 📝 **Monaco Editor Integration** for a VS Code-like coding experience
* 🤝 **Real-Time Collaboration** using Yjs
* ⚡ Live code synchronization between connected users
* 🐳 Secure code execution inside isolated Docker containers
* ☁️ Cloud deployment on AWS
* 🔒 Containerized and sandboxed execution environment
* 🎯 Multi-user collaborative coding support
* 📱 Responsive and modern user interface

---

## 🏗️ Architecture

```text
Client (React + Monaco Editor)
            │
            ▼
     Yjs Collaboration
            │
            ▼
     Node.js + Express
            │
            ▼
     Docker Containers
            │
            ▼
      AWS Infrastructure
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Monaco Editor
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* WebSockets

### Real-Time Collaboration

* Yjs
* y-websocket

### Infrastructure

* Docker
* AWS EC2
* Nginx

---

## 🚀 Key Features Explained

### Monaco Editor

Provides a professional code editing experience with:

* Syntax highlighting
* Auto-completion
* Code formatting
* Multiple language support
* VS Code-like interface

### Yjs Real-Time Collaboration

Enables collaborative coding by:

* Synchronizing changes instantly
* Supporting multiple concurrent users
* Resolving editing conflicts automatically
* Maintaining document consistency

### Docker-Based Execution

Each code execution runs inside an isolated Docker container to ensure:

* Security
* Resource isolation
* Consistent runtime environments
* Safe code execution

### AWS Deployment

Hosted on AWS for:

* Scalability
* Reliability
* High availability
* Easy deployment and maintenance

---

## 📂 Project Structure

```bash
CodeEditor-Docker-aws/
│
├── client/
│   ├── src/
│   └── public/
│
├── server/
│   ├── routes/
│   ├── controllers/
│   └── websocket/
│
├── docker/
│
├── nginx/
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/PranavRasal/CodeEditor-Docker-aws.git

cd CodeEditor-Docker-aws
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## 🔧 Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000

AWS_REGION=your_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

DOCKER_HOST=your_docker_host
```

---

## ▶️ Running Locally

### Start Collaboration Server

```bash
npm run server
```

### Start Frontend

```bash
npm run dev
```

---

## 🐳 Docker Setup

Build Docker Image

```bash
docker build -t code-editor .
```

Run Container

```bash
docker run -p 5000:5000 code-editor
```

---

## ☁️ AWS Deployment

1. Launch an EC2 instance.
2. Install Docker and Node.js.
3. Clone the repository.
4. Configure environment variables.
5. Build and run Docker containers.
6. Configure Nginx as a reverse proxy.
7. Access the application through the public AWS endpoint.

---

## 🎯 Learning Outcomes

Through this project, I gained hands-on experience with:

* Real-time collaborative systems
* WebSocket communication
* Conflict-free replicated data structures (CRDTs) using Yjs
* Docker containerization
* AWS cloud deployment
* Building scalable full-stack applications

---

## 👨‍💻 Author

**Pranav Rasal**

GitHub: https://github.com/PranavRasal

---


