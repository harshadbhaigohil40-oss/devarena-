# DEVARENA

DEVARENA is a modern, high-performance web application designed for developer interviews, competitive programming, and technical assessments. It features a scalable client-server architecture with an interactive IDE, AI-assisted feedback, and gamified progress tracking.

## 🚀 Features

- **Interactive Code Editor:** Built with Monaco Editor (VS Code core) for syntax highlighting, code completion, and a seamless typing experience.
- **Secure Code Execution:** A hardened server-side sandbox for evaluating JavaScript and Python submissions safely.
- **Dynamic Skill Trees:** Track your growth visually through an interactive node-based skill tree.
- **AI Career Advisor:** Get instant, AI-driven code reviews and mentorship using Gemini AI.
- **Gamification:** Earn XP, level up, and collect badges. Compete on global leaderboards.
- **Modern UI:** Built with React, Vite, framer-motion, and a custom design system focusing on performance and premium aesthetics.
- **Performance Optimized:** Route caching, database indexing, and aggressive Vite chunk splitting for lightning-fast load times.

## 🛠️ Technology Stack

**Frontend (Client)**
- React 18
- Vite
- Framer Motion (Animations)
- Tailwind/Vanilla CSS Design System
- Zustand (State Management)
- React Query (Data Fetching)
- Recharts (Data Visualization)
- Socket.io-client (Real-time features)

**Backend (Server)**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & Google OAuth2
- Node-Cache (Route caching)
- Python integration (for multi-language execution)
- Google Generative AI (Gemini)

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Python 3.9+ (for Python code execution)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/devarena.git
   cd devarena
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables:**
   - Copy `.env.example` to `.env` in the root folder (or inside the server folder, depending on your setup).
   - Fill in your `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, etc.

### Running the App

**Start the Server (Development Mode):**
```bash
cd server
npm run dev
```

**Start the Client (Development Mode):**
```bash
cd client
npm run dev
```

The client will typically run on `http://localhost:5173` and the server on `http://localhost:5000`.

## 🛡️ Security Features

- **Sandboxed Execution:** JavaScript runs in a hardened `vm` context. Python runs using isolated sub-processes with restricted imports and site-packages disabled.
- **Rate Limiting & CORS:** Tight CORS policies explicitly mapping to frontend origins.
- **Sanitized Outputs:** Strict field selection (e.g., stripping password hashes, tokens) before responding to API requests.
- **Graceful Shutdown:** Configured to properly close DB connections and drain requests on SIGTERM/SIGINT.

## 📝 License

This project is licensed under the MIT License.
