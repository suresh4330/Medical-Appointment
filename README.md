# Medical Appointment Management System

![status](https://img.shields.io/badge/status-active-brightgreen)
![backend](https://img.shields.io/badge/backend-Node.js%20%7C%20Express%20%7C%20MongoDB-339933?logo=nodedotjs)
![frontend](https://img.shields.io/badge/frontend-React%2018-61DAFB?logo=react)
![auth](https://img.shields.io/badge/auth-JWT-orange?logo=jsonwebtokens)
![license](https://img.shields.io/badge/license-MIT-blue)

> 🌐 **Live Application**: [https://medical-appointment-chi.vercel.app](https://medical-appointment-chi.vercel.app)  
> ⚙️ **Backend API**: [https://medical-appointment-backend-p1jj.onrender.com](https://medical-appointment-backend-p1jj.onrender.com)

**Medical Appointment Management System** is a full-stack role-based appointment platform that enables patients to discover and book doctors by department, and allows doctors to manage, approve, or reject appointment requests — all through a clean, animated interface powered by Framer Motion.

---

## ✨ Features

### 🧑‍⚕️ Doctor
- Register with a chosen **department** (Cardiology, Neurology, etc.)
- View all assigned appointments from patients
- **Approve** or **Reject** appointment requests
- Set a custom approved time slot for the patient

### 🧑‍💼 Patient
- Browse available **doctors filtered by department**
- Book appointments with date and time slot selection
- View all booked appointments with live status updates (`Pending`, `Approved`, `Rejected`)

### 🔐 Authentication
- JWT-based secure login & registration
- Role-based routing (patients → Patient Dashboard, doctors → Doctor Dashboard)
- Passwords hashed with bcryptjs

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, React Router v6, Framer Motion, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **Styling** | Vanilla CSS with glassmorphism & animations |

---

## 📁 Project Structure

```
Medical-Appointment/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Get Doctors
│   │   └── appointmentController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── models/
│   │   ├── User.js             # Patient & Doctor schema (with department)
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── appointmentRoutes.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── DashboardLayout.jsx
        │   └── LoadingSpinner.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── PatientDashboard.jsx
        │   └── DoctorDashboard.jsx
        ├── services/
        │   └── api.js          # Axios instance with JWT interceptor
        ├── styles.css
        └── App.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/suresh4330/Medical-Appointment.git
cd Medical-Appointment
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm start
```

> Backend runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
PORT=3000
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

> Frontend runs on **http://localhost:3000**

---

## 🔑 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/register` | Register patient or doctor | ❌ |
| `POST` | `/login` | Login and receive JWT | ❌ |
| `GET` | `/doctors` | Get all doctors (with department) | ✅ |

### Appointment Routes — `/api/appointments`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Get appointments (role-filtered) | ✅ |
| `POST` | `/` | Book a new appointment (patient) | ✅ |
| `PUT` | `/:id` | Approve or Reject appointment (doctor) | ✅ |

---

## 👥 User Roles

### Registering as a Doctor
Go to `/register` → Select **Role: Doctor** → Choose your **Department** → Register.  
Your name will automatically appear in the patient booking dropdown for your department.

### Registering as a Patient
Go to `/register` → Select **Role: Patient** → Register.  
You can then book appointments with registered doctors.

---

## 🏥 Supported Departments

- Cardiology
- Dermatology
- General Medicine
- Neurology
- Orthopedics
- Pediatrics

---

## 📸 Screenshots

> Patient Dashboard — Book by Department

Patients see only doctors registered in the selected department.

> Doctor Dashboard — Approve / Reject Requests

Doctors can set a custom approved time slot per patient.

---

## 🔒 Security Notes

- `.env` files are **excluded from Git** via `.gitignore`
- Passwords are **never stored in plain text** (bcryptjs hashing)
- All protected routes require a valid **JWT Bearer token**
- Doctor search uses **case-insensitive** matching to prevent booking failures

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Suresh** — [@suresh4330](https://github.com/suresh4330)

> Built with ❤️ using React, Node.js & MongoDB Atlas
