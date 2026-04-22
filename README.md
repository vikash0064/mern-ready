# mern-ready 🚀

[![npm version](https://img.shields.io/npm/v/mern-ready.svg)](https://www.npmjs.com/package/mern-ready)

One command. Full-stack MERN with **Tailwind CSS v4**, JWT Auth, Mongoose, Axios — **Everything wired. Nothing missing.**

## 📦 What's inside?

`mern-ready` scaffolds a professional MVC architecture with the latest stack:

### Frontend (Client)
- **Vite + React 18** (Lightning fast HMR)
- **Tailwind CSS v4** (Zero config, pre-installed)
- **React Router 6** (Pre-configured routes)
- **Axios** (Pre-configured with auth interceptors)
- **Context API** (Ready-to-use Auth State)

### Backend (Server)
- **Node.js & Express**
- **MongoDB & Mongoose** (Connection & Schema ready)
- **JWT Authentication** (Login/Register/Protect middleware)
- **Security Middleware** (Helmet, Rate-limit, CORS, Morgan)
- **Error Handling** (Global error middleware)

---

## 🛠️ Quick Start

```bash
npx mern-ready my-app
```

## 📂 Project Structure

```text
my-app/
├── server/
│   ├── config/db.js        # MongoDB Connection
│   ├── controllers/        # Auth Logic
│   ├── middleware/         # Auth & Error Handlers
│   ├── models/             # User Schema
│   ├── routes/             # API Endpoints
│   └── utils/              # Token & Response Helpers
├── client/
│   ├── src/
│   │   ├── api/            # Axios instance & calls
│   │   ├── context/        # AuthContext
│   │   ├── hooks/          # useApi custom hook
│   │   ├── pages/          # Home, Login, Register, Dash
│   │   └── utils/          # Formatting & class helpers
├── .env                    # Secrets & Config
└── package.json            # One script to rule them all
```

## 🚀 Scripts

From the root directory:

- `npm run dev` — Starts both Frontend (5173) and Backend (5000) using `concurrently`.
- `npm run server` — Starts only the Express server with `nodemon`.
- `npm run client` — Starts only the Vite dev server.

## 📦 Dependencies (Auto-installed)

| Backend | Frontend |
|--- |--- |
| `express@4.19` | `react@18.3` |
| `mongoose@8.4` | `tailwindcss@4.0` |
| `jsonwebtoken@9.0` | `axios@1.7` |
| `bcryptjs@2.4` | `react-router-dom@6.23` |
| `helmet@7.1` | `@tailwindcss/vite@4.0` |

---

Built with ❤️ for developers who hate boilerplate.  
**Happy Coding!**
