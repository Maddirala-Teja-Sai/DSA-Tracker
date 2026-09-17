# 🚀 DSA Study Tracker

A **premium, full-stack DSA (Data Structures & Algorithms) Study Tracker** to organize and track your LeetCode and GeeksForGeeks problem-solving progress. Built with a sleek, modern UI and cloud sync support.

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### 📚 Question Bank
- **246 curated DSA problems** spanning arrays, strings, trees, graphs, DP, and more
- Questions sourced from **LeetCode** and **GeeksForGeeks**
- Difficulty levels: **Easy**, **Medium**, **Hard**
- Frequency ratings to prioritize high-impact problems

### 🔍 Smart Filtering & Views
- Filter by **difficulty**, **platform**, **status** (solved/unsolved/starred), and **frequency**
- **Category view** — group problems by data structure (Array, Tree, Graph, etc.)
- **Pattern view** — group by algorithmic pattern (Sliding Window, Binary Search, Two Pointers, DP, etc.)
- Full-text **search** across all questions

### 📝 Tracking & Notes
- Mark problems as **solved** with automatic date stamps
- **Star** important problems for quick revisits
- Add personal **notes** to any question
- **Activity heatmap** to visualize your daily streak

### ➕ Custom Questions
- Add your own custom questions with title, link, difficulty, category, and topics
- Custom questions integrate seamlessly into all views and filters

### 🔐 Authentication & Cloud Sync
- **Google OAuth** sign-in
- **Email/password** authentication (bcrypt-hashed)
- **JWT cookie-based sessions** for secure, stateless auth
- All progress **syncs to MongoDB Atlas** — access from any device

### 🎨 Premium UI
- Dark-mode interface with glassmorphism effects
- Inter + JetBrains Mono typography
- Confetti celebration animation on milestones
- Smooth micro-animations and transitions
- Fully responsive — works great on mobile and desktop

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| **Frontend** | HTML, CSS (vanilla), JavaScript     |
| **Backend**  | Node.js, Express.js                |
| **Database** | MongoDB (Mongoose ODM)             |
| **Auth**     | JWT, bcryptjs, Google Auth Library  |
| **Fonts**    | Google Fonts (Inter, JetBrains Mono)|

---

## 📁 Project Structure

```
DSA-Tracker/
├── config/
│   └── db.js                # MongoDB connection setup
├── data/
│   ├── questions.js         # 246 curated DSA questions
│   └── dsa_246_final_complete.csv
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   └── User.js              # Mongoose user schema (tracker data, custom questions)
├── routes/
│   ├── auth.js              # Auth routes (login, signup, Google OAuth)
│   └── userData.js          # User data routes (sync progress, notes)
├── secrets/                 # 🔒 Git-ignored — local credentials
├── .env                     # 🔒 Git-ignored — environment variables
├── .env.example             # Template for required env vars
├── .gitignore
├── app.js                   # Frontend application logic
├── index.html               # Single-page application entry
├── style.css                # Complete UI styles
├── server.js                # Express server entry point
├── package.json
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) — local instance or [Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Clone the Repository

```bash
git clone https://github.com/Maddirala-Teja-Sai/DSA-Tracker.git
cd DSA-Tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Port for Express server
PORT=3000

# MongoDB Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dsa-tracker?retryWrites=true&w=majority

# Secret key for JWT (min 32 characters — change this in production!)
JWT_SECRET=your_super_secret_jwt_key_here
```

### 4. Start the Server

```bash
# Production
npm start

# Development
npm run dev
```

The app will be running at **http://localhost:3000** 🎉

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| POST   | `/api/auth/signup`      | Register with email/password |
| POST   | `/api/auth/login`       | Login with email/password    |
| POST   | `/api/auth/google`      | Google OAuth sign-in         |
| POST   | `/api/auth/logout`      | Clear session cookie         |
| GET    | `/api/auth/me`          | Get current user info        |

### User Data

| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | `/api/user/data`        | Fetch saved tracker data |
| POST   | `/api/user/data`        | Sync tracker data to cloud |

### Utility

| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | `/api/health`           | Server health check      |
| GET    | `/api/config/auth`      | Auth configuration       |

---

## 🚀 Deployment

This project is deployment-ready for platforms like **Render**, **Railway**, or **Heroku**.

1. Set the environment variables (`MONGODB_URI`, `JWT_SECRET`) on your hosting platform
2. Set the start command to `npm start`
3. The server binds to `0.0.0.0` and respects the `PORT` env variable automatically

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Maddirala Teja Sai**

- GitHub: [@Maddirala-Teja-Sai](https://github.com/Maddirala-Teja-Sai)

---

> _Track · Solve · Conquer_ 💪
