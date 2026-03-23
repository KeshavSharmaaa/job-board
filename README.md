# 🚀 Premium Job Board Application

A full-stack, modern, and visually stunning Job Board platform designed to connect top talent with elite companies. Featuring a "Premium" aesthetic with smooth transitions, adaptive headers, and a dedicated candidate experience.

## ✨ Features

- **🎯 Context-Aware Navigation**: Dynamic headers that adapt between "Home/Landing" and "Functional/Dashboard" modes.
- **📧 Automated Email Alerts**: 
    - Instant notifications to Employers when a new application is received.
    - Confirmation emails to Candidates upon successful application.
    - Status update alerts (Accepted/Rejected) sent directly to candidates' inboxes.
- **💼 Employer Suite**: 
    - Post jobs with rich descriptions and salary details.
    - Specialized dashboard for managing listings and updating candidate statuses.
- **👨‍💻 Candidate Experience**:
    - **Live Discover Page**: Real-time job browsing with a modern dual-pane layout.
    - **Integrated Sidebar**: Persistent navigation for applied jobs, profile management, and discovery.
    - **One-Click Apply**: Seamless resume uploading and application tracking.
- **🛡️ Secure Authentication**: JWT-based auth with email normalization to prevent login hiccups.
- **🎨 Premium Design System**: Custom glassmorphism-inspired UI, smooth animations, and a refined color palette using Tailwind CSS and custom refinements.

## 🛠️ Tech Stack

**Frontend:**
- **React.js (v19)**: Core UI library.
- **Tailwind CSS**: Utility-first styling for a modern look.
- **React Router Dom (v7)**: Advanced client-side routing.
- **Axios**: Promised-based HTTP client for API interactions.

**Backend:**
- **Node.js & Express**: Robust server-side architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database and schema modeling.
- **JSON Web Token (JWT)**: Secure user session management.
- **Nodemailer**: Enterprise-grade email delivery system.
- **Multer**: Handling file uploads (Resumes).

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Gmail Account**: For sending automated emails (requires an App Password).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KeshavSharmaaa/job-board.git
   cd job-board
   ```

2. **Server Setup:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   PORT=5000
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```
   > **Note**: To get an `EMAIL_PASS`, you must enable 2FA on your Gmail account and create an "App Password" in your Google Security settings.

   Start the server:
   ```bash
   node index.js
   ```

3. **Client Setup:**
   ```bash
   cd ../client
   npm install
   ```
   Start the development server:
   ```bash
   npm start
   ```

## 📬 How the Mail Function Works

This application uses **Nodemailer (Gmail Service)** to keep everyone in the loop:

*   **When a Candidate Applies**:
    *   **The Employer** gets an email with the candidate's name and the role applied for.
    *   **The Candidate** receives a "Success" confirmation email to acknowledge their application.
*   **When an Employer Updates Status**:
    *   If a candidate is **Accepted** or **Rejected**, an automated email is triggered instantly to the candidate's registered email address with a professional update message.

## 📂 Project Structure

```bash
job-board/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI (PremiumNav, CandidateSidebar)
│   │   ├── pages/       # Route-based views
│   │   └── services/    # API configurations
├── server/              # Express backend
│   ├── controllers/     # Business logic (Application, Jobs, Auth)
│   ├── models/          # Mongoose schemas (User, Job, Application)
│   ├── routes/          # API endpoints
│   ├── utils/           # Helper services (Email, Middleware)
│   └── uploads/         # Resume storage (gitignored)
```

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---
