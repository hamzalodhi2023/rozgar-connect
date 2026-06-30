# 🚀 Rozgar Connect
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black)
![License](https://img.shields.io/badge/License-MIT-blue)

> **Connecting Customers with Skilled Local Workers**

Rozgar Connect is a modern **MERN Stack** web application that helps customers find trusted local service providers such as plumbers, electricians, carpenters, painters, AC technicians, mechanics, and other skilled workers.

The platform allows users to register as either a **Customer** or a **Worker**, while supporting role switching so that a single account can perform both roles.

---

## 📖 Project Overview

Finding reliable local workers during emergencies is often difficult. People usually rely on personal references, WhatsApp groups, or neighbors to find workers.

Rozgar Connect provides a centralized platform where workers can showcase their services and customers can easily search, connect, and communicate with them.

---

## ✨ Features

### 👤 Authentication

* Secure User Registration
* Login & Logout
* JWT Authentication
* Refresh Token
* HTTP Only Cookies
* Axios Interceptors
* Protected Routes

---

### 👥 User Roles

Single Account

* Customer
* Worker

Users can switch between roles without creating another account.

---

### 🛠 Worker Features

* Create Worker Profile
* Update Profile
* Upload Profile Photo
* Select Service Category
* Select City & Area
* Add Phone Number
* Add WhatsApp Number
* Add Description
* Receive Customer Messages
* View Ratings & Reviews

---

### 🔍 Customer Features

* Search Workers
* Category Filter
* City Filter
* Area Filter
* View Worker Profile
* Internal Chat
* Give Ratings
* Write Reviews

---

### 💬 Real-Time Chat

* Socket.IO
* Real-Time Messaging
* Typing Indicator
* Online / Offline Status
* Last Seen
* Conversation History
* Responsive Chat UI

---

### ⭐ Rating & Review System

* 1–5 Star Rating
* Customer Reviews
* Average Rating
* Total Reviews

---

### 🛡 Admin Panel

* Manage Users
* Manage Worker Profiles
* Manage Reviews
* Remove Fake Accounts

---

## 🏗 Tech Stack

### Frontend

* React.js (Vite)
* React Router DOM
* Tailwind CSS v4
* Redux Toolkit
* Axios
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* JWT
* bcrypt

### Database

* MongoDB Atlas
* Mongoose

---

## 📂 Project Structure

```text
rozgar-connect/

│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── sockets/
│   ├── config/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
└── README.md
```

---

## 🔐 Authentication Flow

* User Registration
* Login
* JWT Access Token
* Refresh Token
* HTTP Only Cookies
* Axios Interceptors
* Automatic Token Refresh
* Secure Logout

---

## 🗄 Database Collections

* Users
* WorkerProfiles
* Conversations
* Messages
* Reviews

---

## 📱 Responsive Design

The application is fully responsive and optimized for:

* 📱 Mobile
* 📱 Tablet
* 💻 Laptop
* 🖥 Desktop

---

## 🎯 MVP Features

* User Authentication
* Customer & Worker Roles
* Worker Profile
* Search Workers
* Category Filter
* Location Filter
* Internal Chat
* Typing Indicator
* Ratings & Reviews
* Admin Panel

---

## 🚀 Future Features

* CNIC Verification
* GPS Based Search
* Worker Verification Badge
* Online Payments
* Push Notifications
* Voice & Video Calls
* Mobile Applications
* Subscription Plans
* AI Recommendations
* Analytics Dashboard

---

## 🛠 Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

---

## 🌍 Environment Variables

### Backend (.env)

```env
PORT=

NODE_ENV=

MONGO_URI=

ACCESS_TOKEN_SECRET=

REFRESH_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRES_IN=

REFRESH_TOKEN_EXPIRES_IN=

CLIENT_URL=
```

---

## 📌 Development Principles

* Clean Architecture
* MVC Pattern
* Reusable Components
* Modular Code
* Responsive UI
* Secure Authentication
* RESTful APIs
* Scalable Design

---

## 🤝 Contributing

Contributions, feature suggestions, and improvements are welcome.

Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is developed for educational and internship purposes.

---

## 👨‍💻 Author

**Hamza Khan Lodhi**

Full Stack Developer

---

### ⭐ If you like this project, don't forget to give it a star!
