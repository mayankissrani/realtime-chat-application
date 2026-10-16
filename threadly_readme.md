# 💬 Threadly

![Threadly Banner](https://via.placeholder.com/1200x300/fbf9f6/a96d51?text=Threadly+-+Minimal+Real-time+Chat)

> A beautifully minimal, real-time chat application built with Next.js, Node.js, and Socket.io.

Threadly is designed to provide a seamless and distraction-free communication experience. Featuring instantaneous messaging, dynamic channel creation, secure authentication, and seamless image sharing, it serves as a robust foundation for modern community platforms.

---

## ✨ Features

- **⚡ Real-time Messaging:** Lightning-fast, bi-directional communication powered by Socket.io.
- **🏷️ Dynamic Channels:** Create and switch between dedicated chat rooms (Socket.io Rooms) on the fly.
- **🔐 Secure Authentication:** Seamless user login and management using [Clerk](https://clerk.com/).
- **🖼️ Image Uploads:** Native image sharing directly in the chat, powered by [Cloudinary](https://cloudinary.com/).
- **🌙 Dark Mode:** Beautifully crafted light and dark themes that respect system preferences.
- **🎨 Minimalist UI:** A clean, distraction-free interface built from scratch with Tailwind CSS and Lucide icons.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Real-time:** Socket.io-client
- **Auth:** `@clerk/nextjs`
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-time:** Socket.io
- **Uploads:** Multer + Cloudinary

---

## 🚀 Getting Started

Follow these steps to run Threadly locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn
- Accounts on [Clerk](https://clerk.com/) and [Cloudinary](https://cloudinary.com/) for API keys.

### 1. Clone the Repository

```bash
git clone https://github.com/mayankissrani/realtime-chat-application.git
cd realtime-chat-application
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
Create a `.env` file in the `backend` directory and add your Cloudinary credentials:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (`frontend/.env.local`):**
Create a `.env.local` file in the `frontend` directory and add your Clerk credentials:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. Run the Application

You will need two terminal windows to run the frontend and backend concurrently.

**Terminal 1: Start the Backend server**
```bash
cd backend
npm install
npm run dev
```
*(Server runs on http://localhost:5000)*

**Terminal 2: Start the Frontend app**
```bash
cd frontend
npm install
npm run dev
```
*(App runs on http://localhost:3000)*

---

## 📂 Project Structure

```text
threadly/
├── backend/                  # Node.js + Express + Socket.io Server
│   ├── src/
│   │   └── index.ts          # Server entry point & Socket logic
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/              # App router (page.tsx, layout.tsx, globals.css)
│   │   └── middleware.ts     # Clerk authentication middleware
│   ├── package.json
│   └── tailwind.config.ts    # Custom design tokens
└── docker-compose.yml        # Optional DB containerization
```

---

## 🌐 Deployment

To deploy this project to production:
1. **Frontend:** Deploy the `frontend` directory to [Vercel](https://vercel.com).
2. **Backend:** Deploy the `backend` directory to a Node-compatible host like [Render](https://render.com) or [Railway](https://railway.app).
3. **Environment:** Don't forget to update the CORS origins in the backend and the Socket URL in the frontend to point to your live domains!

---

*Built with ❤️ by [Mayank Issrani](https://github.com/mayankissrani)*