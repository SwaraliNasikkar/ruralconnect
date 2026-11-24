<div align="center">

# 🌾 RuralConnect

### Adaptive Learning Engine & 3-Way Stakeholder Bridge for Rural Classrooms

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Bridging the village digital divide through offline resilience, dual-band adaptive UI, and a frictionless 3-way code connection system.</b>
</p>

[Explore Features](#-key-features) • [System Architecture](#-system-architecture) • [Tech Stack](#-tech-stack) • [Quickstart](#-getting-started) • [API Contracts](#-rest-api-reference)

</div>

---

## 📌 Problem Statement

Rural education across emerging regions faces three critical bottlenecks:
1. **Unreliable Internet & Power:** Cloud-only apps fail completely during frequent village network outages.
2. **Age & Literacy Disparity:** Standard educational portals alienate 7-year-olds with clinical dashboards or bore 15-year-olds with childlike interfaces.
3. **Parental Disconnect & Teacher Burden:** Parents with low digital literacy lack visibility into their children's daily learning, while multi-grade teachers struggle with paper assessments and lack tools to track progress.

**RuralConnect** solves this by combining offline-first edge architecture, a dual-band interface that transforms dynamically by grade level, and a zero-friction code system connecting teachers, students, and parents.

---

## 🚀 Key Features

### 🔐 1. 3-Way Code Linking (Zero Email / Phone Requirement for Kids)
* **Class Codes:** Teachers generate 6-character classroom codes (e.g., `L4N3Z6`) that students use to enroll into specific grades and subjects.
* **Unique Parent Codes:** Every student automatically receives an alphanumeric parent code (e.g., `J69QMA`). Parents simply enter this code to instantly link to their child's live profile without requiring passwords, emails, or student IDs.

### 🎨 2. Dual-Band Adaptive UI Engine
The entire client transforms based on the selected standard:
* **Primary Wonder World (Classes 1–5):** Sunny playful theme, cartoon animal learning buddies, Chintu mascot audio synthesis, and interactive gamified slide decks.
* **Secondary STEM Hub (Classes 6–10):** Dark futuristic STEM workbench, circuit diagrams, physics laboratory modules, and distraction-free layouts.

### 👩‍🏫 3. Teacher Classroom Console
* **Assigned Classrooms Only:** Teachers only see the specific classes and standards they teach.
* **Student Activity Tracker:** Detailed breakdown of registered students, completed lectures, attendance streaks, and quiz attempts.
* **Study Material & Practical Creator:** Author lectures with slide decks and village-contextual hands-on experiments (e.g., clay pot evaporation, courtyard shadow clocks, paper chapati fractions).
* **Test Builder & Evaluator:** Create objective quizzes, review student attempts, grade answers, and write personalized remarks.

### 👨‍👩‍👧 4. Parent Portal with SVG Trend Graphs
* **Personalized Greeting:** Greeted with *"Welcome, Parent of [Child Name]! 🎉"*.
* **Dynamic SVG Performance Graph:** Vector line and area chart plotting test marks and percentage trends over time against a 75% target benchmark.
* **Voice Read-Aloud (`🔊 Listen in Voice`):** Native Web Speech API synthesis reads complete student progress aloud for parents with lower literacy levels.
* **Activity & Marks Breakdown:** Complete logs of completed experiments, quiz marks, and teacher remarks.

### ⚡ 5. Offline-First Resilience
* Built-in local caching and sync queue. Students can complete lessons and take quizzes during network dropouts; submissions queue locally and sync with idempotent deduplication once the village hub reconnects.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client["Frontend Client (Vite + React 19)"]
        UI[Tailwind CSS v4 + Lucide React]
        Engine[Adaptive Engine: Primary vs STEM]
        Voice[Web Audio API + SpeechSynthesis]
        Charts[Dynamic SVG Trend Graph Engine]
        Sync[Offline Local Cache & Sync Queue]
    end

    subgraph Server["Backend REST API (Node.js + Express)"]
        Router[API Gateway & Controllers]
        Auth[JWT Authentication & RBAC Middleware]
        PortalService[Teacher & Parent Aggregation Service]
    end

    subgraph Storage["Database Layer (MongoDB Atlas)"]
        Users[(User Collection)]
        Content[(Lesson & Quiz Collections)]
        Progress[(LessonProgress & QuizAttempt Collections)]
        Announcements[(Announcement Collection)]
    end

    Client -->|REST API + Bearer JWT| Server
    Server -->|Mongoose 9.x ODM| Storage
```

### 🔁 The 3-Way Code Flow


---

## 💻 Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `19.0.1` | Concurrent rendering, modern hooks, responsive UI state. |
| **Type System** | TypeScript | `7.0.2` | Strict interface contracts across frontend and backend models. |
| **Build Tool** | Vite | `8.3.0` | Sub-second HMR, optimized static bundling. |
| **Styling** | Tailwind CSS | `4.3.3` | Modern utility styling with dynamic theme variable injection. |
| **Icons** | Lucide React | `0.546.0` | Lightweight SVG icons for dashboard navigation. |
| **Audio / Speech** | Web Audio API | Native | Speech synthesis for parent read-aloud and tactile UI chimes. |
| **Vector Engine** | Native SVG | Native | Zero-dependency, offline-ready score trend charts. |
| **Backend Runtime** | Node.js (ESM) | `24.x` | Asynchronous, non-blocking REST API service. |
| **Server Framework** | Express.js | `4.21.2` | Route orchestration and custom role-based middleware. |
| **Database** | MongoDB Atlas | Cloud Cluster | Scalable document store for dynamic content and slide decks. |
| **Object Modeling** | Mongoose | `9.11.4` | Strictly typed schemas, indexing, and relation population. |
| **Authentication** | JWT (`jsonwebtoken`) | `9.0.3` | Stateless 7-day token sessions for low-bandwidth networks. |
| **Security** | `bcryptjs` | `3.0.3` | Cryptographic salting (10 rounds) and password hashing. |

---

## 🚦 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (`v18+` or `v24+`)
* [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URL or a local MongoDB instance

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ruralconnect---adaptive-learning-platform.git
cd ruralconnect---adaptive-learning-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `server/` directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ruralconnect?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### 4. Seed Initial Curriculum *(Optional)*
Populate the database with pre-configured State Board lessons and quizzes:
```bash
npm run seed
```

### 5. Launch the Application
Open two separate terminal windows:

**Terminal 1 — Backend Server:**
```bash
npm run server
# 🚀 API running on http://localhost:5000
```

**Terminal 2 — Frontend Client:**
```bash
npm run dev
# ➜ Local: http://localhost:3000
```

---

## 📡 REST API Reference

All protected endpoints require an `Authorization: Bearer <TOKEN>` header.

### 🔑 Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register Student, Teacher, or Parent; auto-generates codes. |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return 7-day JWT. |
| `GET` | `/api/auth/me` | Authenticated | Validate token and retrieve the active user profile. |

### 👩‍🏫 Teacher Console
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/teacher/classes` | Teacher | List all classrooms assigned to the logged-in teacher. |
| `GET` | `/api/teacher/students` | Teacher | Fetch enrolled students, activity counts, and streaks. |
| `POST` | `/api/teacher/lessons` | Teacher | Publish study materials with slide decks and practicals. |
| `POST` | `/api/teacher/quizzes` | Teacher | Publish chapter tests with multiple-choice questions. |
| `PATCH`| `/api/teacher/attempts/:id/evaluate` | Teacher | Update marks and record feedback for student attempts. |
| `POST` | `/api/teacher/notices` | Teacher | Broadcast notices to classroom students and parents. |

### 👨‍👩‍👧 Parent Portal
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/parent/children` | Parent | List all children linked to the parent account. |
| `POST` | `/api/parent/link` | Parent | Link child using 6-character `parentCode`. |
| `GET` | `/api/parent/children/:id/report` | Parent | Retrieve child's completed activities, marks, and graph history. |

### 🎒 Student Workbench
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/lessons` | Student | Fetch accessible lessons (built-in + teacher-assigned). |
| `POST` | `/api/progress` | Student | Record slide progress and award completion XP. |
| `POST` | `/api/quizzes/:id/attempt` | Student | Submit quiz answers, score, and update study streak. |
| `POST` | `/api/student/join` | Student | Enroll into a classroom using a teacher's `classCode`. |

---

## 🔒 Security & Data Integrity

* **Password Security:** Salted and hashed using `bcryptjs` with 10 salt rounds prior to persistence.
* **Data Isolation:** Teachers can only inspect students enrolled in their assigned classrooms; parents can only view data for children explicitly tied to their account.
* **Collision-Resilient Codes:** Alphanumeric codes use an unambiguous 30-character alphabet (excluding `0/O` and `1/I`) and are verified for uniqueness at the database level.
* **Offline Idempotency:** Submissions carry a client-generated UUID; duplicate sync attempts during network reconnections are safely ignored without double-awarding XP.

---

