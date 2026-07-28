# Kanban Board 📋

A full-stack MERN Kanban board application for organizing tasks into boards, lists, and cards — with drag-and-drop support, user authentication, and avatar uploads.

**🔗 Live Demo:** [https://kanbanboard-five-flame.vercel.app/](https://kanbanboard-five-flame.vercel.app/)

---

## Features

- 🔐 **User Authentication** — Register/login with JWT-based auth (access + refresh tokens), secure httpOnly cookies
- 🖼️ **Avatar Upload** — Users can upload a profile avatar during registration (via Multer + cloud storage)
- 📌 **Boards** — Create, view, and delete personal Kanban boards
- 📃 **Lists** — Add, edit, delete, and reorder lists within a board
- 🗂️ **Cards** — Add, edit, delete, and drag cards between lists
- 🖱️ **Drag & Drop** — Smooth list and card reordering powered by `@hello-pangea/dnd`
- 🔄 **Persistent Ordering** — List/card positions are saved to the database on every reorder
- 🛡️ **Protected Routes** — Dashboard and board pages require authentication

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Axios
- Tailwind CSS
- @hello-pangea/dnd (drag and drop)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (access & refresh tokens)
- Multer (file uploads)
- bcrypt (password hashing)

**Deployment**
- Frontend hosted on **Vercel**
- Backend hosted on **Render**
- Database hosted on **MongoDB Atlas**

---

## Project Structure

```
Kanban_board/
├── Frontend/          # React + Vite client
│   ├── src/
│   │   ├── pages/     # Register, Login, Dashboard
│   │   ├── api/        # Axios instance config
│   │   ├── components/ # Protected routes, shared UI
│   │   └── boardPage.jsx
│   └── vercel.json     # SPA rewrite config
│
└── Backend/           # Express + MongoDB API
    └── src/
        ├── controllers/
        ├── models/
        ├── routes/
        ├── middlewares/
        └── index.js
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js installed
- A MongoDB connection string (local or MongoDB Atlas)

### Backend Setup
```bash
cd Backend
npm install
# create a .env file with your MongoDB URI, JWT secrets, etc.
npm run dev
```

### Frontend Setup
```bash
cd Frontend
npm install
# create a .env file:
# VITE_API_URL=http://localhost:8000
npm run dev
```

---

## Environment Variables

**Backend `.env`**
```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
CORS_ORIGIN=http://localhost:5173
```

**Frontend `.env`**
```
VITE_API_URL=http://localhost:8000
```

---

## License

This project is open source and available for learning purposes.
