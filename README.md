# Saloni Singh — Portfolio

A premium, modern, highly interactive personal portfolio website.

## 🚀 Tech Stack

**Frontend:** React · TypeScript · Vite · Tailwind CSS · Framer Motion · React Router  
**Backend:** Node.js · Express.js · MongoDB Atlas · JWT Auth  
**Deployment:** Frontend → Vercel · Backend → Render · DB → MongoDB Atlas  

---

## 📁 Project Structure

```
Portfolio/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/    # Navbar, Footer, Cursor, Loading
│   │   │   └── sections/  # Hero, About, Skills, Projects, etc.
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── admin/     # AdminLogin, AdminDashboard
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API client (axios)
│   │   ├── types/         # TypeScript interfaces
│   │   └── utils/         # Constants, helpers
│   └── vite.config.ts
│
└── backend/           # Node.js + Express
    ├── controllers/   # Route handlers
    ├── models/        # Mongoose schemas
    ├── routes/        # Express routers
    ├── middlewares/   # Auth, error handler
    ├── config/        # DB, Cloudinary
    └── server.js
```

---

## 🛠️ Local Development

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs at `http://localhost:5173`

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, etc.
npm run dev
```

Runs at `http://localhost:5000`

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=app-password
EMAIL_TO=your@gmail.com
FRONTEND_URL=https://your-portfolio.vercel.app
```

---

## 🌐 Deployment

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add `VITE_API_URL=https://your-backend.onrender.com/api` in environment variables
4. Deploy

### Backend → Render
1. Connect GitHub repo to Render
2. Set root directory to `backend`
3. Set start command: `npm start`
4. Add all environment variables from `render.yaml`
5. Deploy

---

## 🔐 Admin Panel

Access at `/admin/login`  
Default credentials (change in `.env`):
- Username: `admin`
- Password: `Admin@1234`

Features:
- Manage Projects (Add/Edit/Delete + Image Upload)
- Manage Certificates
- View/Reply to Contact Messages
- Dashboard analytics

---

## ✨ Features

- Animated particle hero with mouse interaction
- Custom cursor effects
- Glassmorphism cards throughout
- Interactive skills showcase with hover animations
- Project cards with 3D tilt effect
- Scroll-triggered animations on all sections
- Animated counters in About section
- Dynamic timeline for experience
- DSA progress charts
- Coding profiles section
- Resume viewer with PDF download
- Contact form with email notifications & auto-reply
- Full admin dashboard with JWT auth
- Scroll progress indicator
- Loading screen animation
- Mobile-responsive design

---

Built with ❤️ by **Saloni Singh**
