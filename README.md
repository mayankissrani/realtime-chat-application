# 💬 Real-Time Chat Application

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack, highly scalable real-time chat application. It provides instant messaging, media sharing, and secure user authentication, wrapped in a modern and fully responsive UI.

## ✨ Features

- **Real-Time Messaging:** Powered by Socket.io for instantaneous, low-latency communication.
- **Secure Authentication:** Integrated with [Clerk](https://clerk.com/) for seamless and secure login/registration workflows.
- **Media Uploads:** Send images securely using Cloudinary.
- **Modern UI:** Built with Next.js 16, Tailwind CSS v4, and Radix UI components for an accessible, beautiful interface.
- **Type Safe:** End-to-end type safety with TypeScript and Zod schema validation.
- **Containerized Database:** Local development is made easy and consistent with Docker and PostgreSQL.

## 🛠️ Tech Stack

**Frontend (Next.js)**
- React 19 / Next.js 16
- Tailwind CSS v4
- Socket.io-client
- React Hook Form + Zod
- Radix UI & Lucide Icons

**Backend (Node.js / Express)**
- Express.js
- Socket.io
- PostgreSQL (`pg`)
- Cloudinary (Image storage)
- Helmet & CORS (Security)

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) (for running the PostgreSQL database)

### 1. Clone the repository
```bash
git clone https://github.com/mayankissrani/realtime-chat-application.git
cd realtime-chat-application
```

### 2. Set up the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory with the following keys:
```env
PORT=5000
DATABASE_URL=postgres://postgres:postgres@localhost:6450/realtime_chat_and_threads_app
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Start the database and run the server:
```bash
# Start PostgreSQL via Docker
docker-compose up -d

# Start the backend development server
npm run dev
```

### 3. Set up the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend/` directory with the following keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Start the frontend application:
```bash
npm run dev
```

## 📂 Project Structure

```text
realtime-chat-application/
├── backend/                # Express API & Socket.io Server
│   ├── src/                # Backend source code
│   └── package.json        
├── frontend/               # Next.js Application
│   ├── src/                # Frontend source code
│   └── package.json        
├── docker-compose.yml      # PostgreSQL container configuration
└── README.md
```
