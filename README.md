# DEVARENA 🚀

DEVARENA is a modern, high-performance web application designed for developer interviews, competitive programming, and technical assessments. It features a scalable client-server architecture with an interactive IDE, AI-assisted feedback, and gamified progress tracking.

---

## ✨ Features

- **Interactive Code Editor:** Built with Monaco Editor (VS Code core) for syntax highlighting, code completion, and a seamless typing experience.
- **Secure Code Execution:** A hardened server-side sandbox for evaluating JavaScript and Python submissions safely.
- **Dynamic Skill Trees:** Track your growth visually through an interactive node-based skill tree.
- **AI Career Advisor:** Get instant, AI-driven code reviews and mentorship using the latest **Gemini AI (2.5 Flash)**.
- **Gamification:** Earn XP, level up, and collect badges. Compete on global leaderboards.
- **Modern UI:** Built with React, Vite, Framer Motion, and a custom design system focusing on performance and premium aesthetics.
- **Performance Optimized:** Route caching, database indexing, and aggressive Vite chunk splitting for lightning-fast load times.

---

## 🛠 Technology Stack

### Frontend (Client)
- **Framework:** React 18 & Vite
- **Animations:** Framer Motion
- **Styling:** Custom CSS / Tailwind CSS Design System
- **State Management:** Zustand
- **Data Fetching:** React Query
- **Visualization:** Recharts
- **Real-time:** Socket.io-client

### Backend (Server)
- **Environment:** Node.js & Express
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Tokens (JWT) & Google OAuth2
- **Performance:** Node-Cache (Route caching)
- **Execution:** Python integration (for multi-language execution)
- **AI Integration:** Google Generative AI (Gemini 2.5)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Python 3.9+ (for Python code execution)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/harshadbhaigohil40-oss/devarena-.git
   cd devarena
   ```

2. **Install Dependencies (Root Workspace):**
   ```bash
   npm install
   ```
   *(Alternatively, run `npm install` inside both the `client` and `server` folders.)*

3. **Environment Variables:**
   - Copy `.env.example` to `.env` in the root folder.
   - Fill in your `MONGODB_URI`, `JWT_SECRET`, and **`GEMINI_API_KEY`**.

### Running the App Locally

This project uses `concurrently` to run both client and server from the root directory:

```bash
npm run dev
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

---

## 🛡 Security Features

- **Sandboxed Execution:** JavaScript runs in a hardened `vm` context. Python runs using isolated sub-processes with restricted imports and site-packages disabled.
- **Rate Limiting & CORS:** Tight CORS policies explicitly mapping to frontend origins.
- **Sanitized Outputs:** Strict field selection (e.g., stripping password hashes, tokens) before responding to API requests.
- **Graceful Shutdown:** Configured to properly close DB connections and drain requests on SIGTERM/SIGINT.

---

## 📝 License

This project is licensed under the MIT License.
