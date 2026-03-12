# Doctor Appointment System - Backend API

The backend API for the Doctor Appointment System, built with Node.js, Express, TypeScript, and MongoDB. It handles user authentication, appointment scheduling, doctor management, and administrative functions.

## 🚀 Features

- **Authentication**: Secure JWT-based auth with role management (Patient, Doctor, Admin).
- **Appointment Management**: Booking, approving, cancelling, and viewing appointments.
- **Doctor Management**: specialized profiles for doctors.
- **Role-Based Access Control (RBAC)**: Protected routes ensuring data security.
- **Real-time Data**: Live status updates for appointments.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **Validation**: Zod (or similar validation logic)

## 📦 Setup & Installation

1.  **Clone the Repository**

    ```bash
    git clone <repository-url>
    cd api
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root of the `api` directory:

    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/doctor-app
    JWT_SECRET=your_super_secret_key
    CLIENT_URL=http://localhost:5173
    ```

4.  **Run the Server**

    ```bash
    # Development Mode
    npm run dev

    # Production Build
    npm run build
    npm start
    ```

---

---

## 📊 Database Schema

For detailed database schema, field descriptions, and the entity-relationship (ER) diagram, please refer to:

👉 **[DATABASE.md](./DATABASE.md)**

---

## 🔌 API Endpoints

### 🔐 Authentication

| Method | Endpoint                | Description               | Auth Required |
| :----- | :---------------------- | :------------------------ | :------------ |
| `POST` | `/api/v1/auth/register` | Register a new user       | ❌            |
| `POST` | `/api/v1/auth/login`    | Login user & return token | ❌            |

### 👤 Users

| Method   | Endpoint            | Description                                          | Auth Required |
| :------- | :------------------ | :--------------------------------------------------- | :------------ |
| `GET`    | `/api/v1/users`     | Get all users (Admin only, supports `?role=patient`) | ✅ (Admin)    |
| `GET`    | `/api/v1/users/:id` | Get single user details                              | ✅            |
| `PATCH`  | `/api/v1/users/:id` | Update user profile                                  | ✅            |
| `DELETE` | `/api/v1/users/:id` | Delete user                                          | ✅ (Admin)    |

### 👨‍⚕️ Doctors

| Method   | Endpoint              | Description               | Auth Required    |
| :------- | :-------------------- | :------------------------ | :--------------- |
| `POST`   | `/api/v1/doctors`     | Register as a Doctor      | ✅               |
| `GET`    | `/api/v1/doctors`     | Get all doctors           | ❌               |
| `GET`    | `/api/v1/doctors/:id` | Get single doctor details | ❌               |
| `PATCH`  | `/api/v1/doctors/:id` | Update doctor profile     | ✅ (Owner/Admin) |
| `DELETE` | `/api/v1/doctors/:id` | Delete doctor             | ✅ (Admin)       |

### 📅 Appointments

| Method  | Endpoint                   | Description                         | Auth Required     |
| :------ | :------------------------- | :---------------------------------- | :---------------- |
| `POST`  | `/api/v1/appointments`     | Book an appointment                 | ✅ (Patient)      |
| `GET`   | `/api/v1/appointments`     | Get all appointments (Admin/Doctor) | ✅                |
| `GET`   | `/api/v1/my-appointments`  | Get logged-in user's appointments   | ✅                |
| `PATCH` | `/api/v1/appointments/:id` | Update status (approve/cancel)      | ✅ (Admin/Doctor) |

### 🛡️ Admin

| Method | Endpoint              | Description              | Auth Required |
| :----- | :-------------------- | :----------------------- | :------------ |
| `GET`  | `/api/v1/admin/stats` | Get Dashboard Statistics | ✅ (Admin)    |
