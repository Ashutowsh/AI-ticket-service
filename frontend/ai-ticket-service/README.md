# 🛠️ Smart Ticketing System - Service

A modern, role-based ticket management system built with **React**, **MongoDB**, **Express**, and **DaisyUI**. It allows organizations or developer teams to efficiently manage support tickets, assign them based on skills, and keep track of status and priorities. Here, I am using Inngest and Gemini to run background AI agent jobs that carry out specific actions.

---

## 🚀 Features

- 📝 Ticket creation, viewing, and editing
- 👤 User authentication with role-based access (Admin, Moderator, User)
- 🧠 Skill tagging to help assign tickets to the right person
- 🔄 Ticket metadata like status, priority, and helpful notes
- 📅 View ticket timestamps and author info
- 🧾 Clean UI with DaisyUI + TailwindCSS

---

## ⚙️ Tech Stack

- **Frontend**: React, React Router, Axios, DaisyUI, TailwindCSS  
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Inngest, Gemini
- **Auth**: JWT (JSON Web Token) based authentication

---

## 🧪 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Ashutowsh/AI-ticket-service.git

1. Install dependencies --> npm install for both frontend and backend.
2. Fill your env variables - refer to sample.env files
```
### 2. You will have to open 3 terminals

  ``` bash
    1. backend-server  --> Terminal 1
        cd backend
        npm run dev

    2. inngest - AI agent background jobs  ---> Terminal 2
        cd backend
        npm run inngest-dev

    3. frontend -----> Terminal 3
        cd frontend
        npm run dev
    
