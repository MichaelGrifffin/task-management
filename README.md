# 📋 Task Management Application (Intern Task Submission)

A modern, full-stack Task Management Web Application designed and built for creating, updating, tracking, and synchronizing tasks in real-time.

---

## ✨ Features

- **🔒 User Authentication & Authorization**:
  - Secure JWT (JSON Web Tokens) user session management.
  - Password encryption using `bcryptjs`.
  - Protected REST API endpoints.

- **⚡ Real-time Synchronization**:
  - Powered by **WebSockets (`ws`)**.
  - Any task modification (creation, status update, deletion) instantly broadcasts to all connected clients without requiring a page refresh.

- **🎯 Complete Task CRUD**:
  - Create, read, update, and delete tasks.
  - Categories & Statuses: **To Do**, **In Progress**, **Completed**.
  - Priorities: **Low**, **Medium**, **High**, **Urgent** (with visual pulse indicator).
  - Dynamic tags and Due Date tracking with overdue warnings.

- **📊 Visual Analytics Dashboard**:
  - Live task completion progress bar.
  - Counters for Total, In Progress, Completed, and Urgent Pending tasks.

- **🎨 Flexible Views & Modern UI/UX**:
  - **Kanban Board View**: Drag/quick-move tasks between columns.
  - **List View**: Structured table format with instant status switches.
  - **Search & Filters**: Filter by priority or status and search by keywords or tags.
  - **Theme Toggle**: Dark mode & Light mode support.

---

## 🛠️ Tech Stack Architecture

- **Backend**:
  - **Runtime**: Node.js & Express.js
  - **Database**: SQLite3 (`tasks.db` local persistence file)
  - **Auth**: JWT (`jsonwebtoken`) + Password hashing (`bcryptjs`)
  - **Real-Time**: WebSockets (`ws`)

- **Frontend**:
  - **Framework**: React 18 (Vite)
  - **Icons**: Lucide React
  - **Styling**: Vanilla Modern CSS (Design System Tokens, Glassmorphism, Responsive Grid)

---

## 🚀 Getting Started / Running Locally

### 1. Install Dependencies

In the root directory, run:
```bash
npm run install:all
```
*Or manually install inside `server/` and `client/`:*
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Start Backend Server & Frontend Dev Server

**Terminal 1 (Backend Server):**
```bash
cd server
npm start
```
*Server starts on `http://localhost:5000` with WebSocket listening on `ws://localhost:5000`.*

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
*Vite frontend opens on `http://localhost:3000`.*

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | ❌ No |
| `POST` | `/api/auth/login` | Login user and receive JWT token | ❌ No |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | ✅ Yes |
| `GET` | `/api/tasks` | Fetch tasks (supports `status`, `priority`, `search`) | ✅ Yes |
| `POST` | `/api/tasks` | Create a new task | ✅ Yes |
| `PUT` | `/api/tasks/:id` | Update task details or status | ✅ Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | ✅ Yes |
