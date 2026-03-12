# Doctor Appointment System 🏥

A full-stack web application for managing doctor appointments. Patients can book appointments, and admins can manage doctors and appointments through a dashboard.

**Built with:** React, Node.js, Express, MongoDB, Tailwind CSS

---

## 📋 What You Need Before Starting

Before running this app, make sure you have these installed on your computer:

| Software | How to Check | How to Install |
|----------|-------------|----------------|
| **Node.js** (v16 or above) | Run `node --version` in terminal | [Download from nodejs.org](https://nodejs.org/) |
| **MongoDB** | Run `mongod --version` in terminal | See instructions below ⬇️ |
| **Git** (optional) | Run `git --version` in terminal | [Download from git-scm.com](https://git-scm.com/) |

### Installing MongoDB (if you don't have it)

**On Ubuntu/WSL:**
```bash
# 1. Import MongoDB key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# 2. Add MongoDB repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 3. Install MongoDB
sudo apt update && sudo apt install -y mongodb-org

# 4. Start MongoDB
sudo systemctl start mongod

# 5. (Optional) Make MongoDB start automatically on reboot
sudo systemctl enable mongod
```

**On Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Windows:** Download the installer from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

---

## 🚀 How to Run the App (Step by Step)

### Step 1: Make sure MongoDB is running

Open a terminal and run:
```bash
# On Ubuntu/WSL
sudo systemctl start mongod

# To verify it's running
mongosh
# If you see a ">" prompt, MongoDB is running! Type "exit" to close.
```

### Step 2: Set up the Backend (API Server)

Open a **new terminal** and run these commands one by one:

```bash
# Go to the api folder
cd Doctor-Appiontment/Doctor-Appiontment/api

# Create the config file (copy the template)
cp .env.example .env

# Install dependencies
npm install

# Start the backend server
npm start
```

✅ **You should see:** `Server is running on port 5000` and `Database connected` (or similar).  
❌ **If you see a database error:** Make sure MongoDB is running (Step 1).  

> ⚠️ **Keep this terminal open!** The backend needs to keep running.

### Step 3: Set up the Frontend (React App)

Open a **second terminal** (don't close the first one!) and run:

```bash
# Go to the project root folder
cd Doctor-Appiontment/Doctor-Appiontment

# Create the config file (copy the template)
cp .env.example .env

# Install dependencies
npm install

# Start the frontend
npm run dev
```

✅ **You should see:** Something like `Local: http://localhost:5173/`

### Step 4: Open the App! 🎉

Open your web browser and go to: **http://localhost:5173**

---

## 👤 How to Use the App

### First Time Setup

1. **Go to** `http://localhost:5173/login`
2. **Click "Sign Up"** and create your first account
   - 🔑 **Important:** The very first account created automatically becomes the **Admin**!
3. **Log in** with your new account

### As Admin (first account)

After logging in, go to `http://localhost:5173/dashboard`. From here you can:
- ➕ **Add Doctors** — Go to "Add Doctor" in the sidebar
- 👨‍⚕️ **Manage Doctors** — Edit or remove doctors
- 📋 **View All Appointments** — See all bookings
- 👥 **View All Patients** — See registered patients
- 📩 **View Contact Messages** — Read messages from patients

### As a Patient (any other account)

- 🏠 Browse the **Home Page** to see available doctors
- 📅 Click on a doctor to view details and **book an appointment**
- 📝 Contact the clinic through the **Contact Form**

---

## 🛑 How to Stop the App

Press `Ctrl + C` in both terminals (backend and frontend) to stop the servers.

---

## 📁 Project Structure

```
Doctor-Appiontment/
├── api/                  # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/  # Business logic (auth, appointments, doctors, etc.)
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API endpoints
│   │   └── middlewares/  # Authentication middleware
│   └── .env.example      # Backend config template
├── src/                  # Frontend (React + Vite)
│   ├── components/       # UI components
│   ├── pages/            # App pages
│   ├── context/          # Auth state management
│   └── routes/           # App routing
├── .env.example          # Frontend config template
└── README.md             # This file!
```

---

## ❓ Common Issues

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED 127.0.0.1:5000` | Backend isn't running. Start it first (Step 2) |
| `Failed to connect to Database` | MongoDB isn't running. Start it (Step 1) |
| `npm install` fails with peer dependency errors | Delete `node_modules` and `package-lock.json`, then run `npm install` again |
| 404 error when clicking on services | Those pages haven't been built yet — it's expected |
| Can't access admin dashboard | Make sure you're logged in with the **first account** you created |

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
