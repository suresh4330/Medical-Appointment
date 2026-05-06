# 🚀 Deployment Guide — Medical Appointment Management System

> **Stack**: React (Frontend) → **Vercel** | Node.js/Express (Backend) → **Render** | MongoDB → Already on **Atlas** ✅

---

## Architecture Overview

```
Browser → Vercel (React Frontend)
               ↓ API calls
          Render (Node.js Backend)
               ↓ Database
         MongoDB Atlas (already live)
```

---

## Step 1 — Deploy Backend on Render (Free)

Render is the best free host for Node.js backends.

### 1.1 Sign Up
Go to 👉 [https://render.com](https://render.com) → Sign up with GitHub

### 1.2 Create a New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo: `suresh4330/Medical-Appointment`
3. Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `medical-appointment-backend` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free |

### 1.3 Add Environment Variables
In Render → **Environment** tab, add these 3 variables:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGO_URI` | *(your full MongoDB Atlas connection string)* |
| `JWT_SECRET` | *(your secret key, e.g. `mySuper$ecret123`)* |

### 1.4 Deploy
Click **"Create Web Service"** → Wait ~2 minutes.

You'll get a URL like:
```
https://medical-appointment-backend.onrender.com
```
> ⚠️ **Copy this URL** — you need it for the frontend step.

---

## Step 2 — Fix MongoDB Atlas Network Access

Your MongoDB Atlas currently only allows your local IP. You need to allow Render's servers.

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click **Network Access** → **Add IP Address**
3. Click **"Allow Access from Anywhere"** → `0.0.0.0/0`
4. Click **Confirm**

---

## Step 3 — Deploy Frontend on Vercel (Free)

### 3.1 Sign Up
Go to 👉 [https://vercel.com](https://vercel.com) → Sign up with GitHub

### 3.2 Import Project
1. Click **"New Project"**
2. Select your repo: `suresh4330/Medical-Appointment`
3. Fill in these settings:

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | `Create React App` |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |

### 3.3 Add Environment Variable
In Vercel → **Environment Variables** section, add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://medical-appointment-backend.onrender.com/api` |

> Replace with **your actual Render URL** from Step 1.4

### 3.4 Deploy
Click **"Deploy"** → Wait ~2 minutes.

You'll get a live URL like:
```
https://medical-appointment.vercel.app
```

---

## Step 4 — Test Your Live App

1. Open your Vercel URL
2. Register as a **Doctor** → pick a department
3. Register as a **Patient** → book an appointment with that doctor
4. Login as the doctor → Approve/Reject the appointment

---

## 🔁 Future Updates

Every time you push to GitHub, both Vercel and Render **auto-redeploy** automatically.

```bash
git add -A
git commit -m "your update message"
git push origin main
# → Vercel & Render redeploy automatically ✅
```

---

## ⚠️ Common Issues

| Problem | Fix |
|---------|-----|
| Backend URL not working | Check Render logs; verify env variables are set |
| "Network Error" on login | Make sure `REACT_APP_API_URL` points to Render URL |
| MongoDB connection fails | Add `0.0.0.0/0` to Atlas Network Access |
| Render goes to sleep (free tier) | First request after ~15 min may be slow — normal |

---

## 💰 Cost

| Service | Cost |
|---------|------|
| Vercel (Frontend) | **Free** ✅ |
| Render (Backend) | **Free** ✅ (sleeps after 15min inactivity) |
| MongoDB Atlas | **Free** ✅ (512MB included) |

**Total: $0/month** 🎉
