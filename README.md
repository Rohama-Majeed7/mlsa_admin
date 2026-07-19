# MLSA Dashboard

A full-stack MERN application for the **Microsoft Learn Student Ambassadors (MLSA)** site. Admins can manage events and team members; visitors see them on the public homepage.

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React, Vite, React Router |
| Backend  | Node.js, Express        |
| Database | MongoDB, Mongoose       |
| Auth     | JWT                     |
| Uploads  | Multer (local storage)  |

## Features

### Public Site (`/`)
- Hero section with MLSA branding
- Events grid: image, title, description, external URL
- Team section: photo, name, designation

### Admin Dashboard (`/admin`)
- JWT-protected login
- **Events CRUD** — add, edit, delete events with image upload
- **Team CRUD** — add, edit, delete team members with photo upload

## Project Structure

```
MLSA-Backend/
├── backend/
│   ├── models/       # Event, TeamMember, Admin schemas
│   ├── routes/       # API routes
│   ├── middleware/   # Auth & file upload
│   ├── uploads/      # Uploaded images
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/    # Home, Login, Dashboard, Admin pages
│       ├── components/
│       └── api.js    # Axios API client
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs at **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:3000**

## Default Admin Credentials

Configure in `backend/.env`:

| Variable         | Default           |
|------------------|-------------------|
| `ADMIN_EMAIL`    | admin@mlsa.com    |
| `ADMIN_PASSWORD` | admin123          |

The default admin account is created automatically on first startup.

## API Endpoints

### Auth
| Method | Endpoint          | Auth | Description     |
|--------|-------------------|------|-----------------|
| POST   | `/api/auth/login` | No   | Admin login     |
| GET    | `/api/auth/me`    | Yes  | Current admin   |

### Events
| Method | Endpoint           | Auth | Description      |
|--------|--------------------|------|------------------|
| GET    | `/api/events`      | No   | List all events  |
| POST   | `/api/events`      | Yes  | Create event     |
| PUT    | `/api/events/:id`  | Yes  | Update event     |
| DELETE | `/api/events/:id`  | Yes  | Delete event     |

### Team
| Method | Endpoint          | Auth | Description           |
|--------|-------------------|------|-----------------------|
| GET    | `/api/team`       | No   | List all members      |
| POST   | `/api/team`       | Yes  | Create member         |
| PUT    | `/api/team/:id`   | Yes  | Update member         |
| DELETE | `/api/team/:id`   | Yes  | Delete member         |

Protected routes require header: `Authorization: Bearer <token>`

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mlsa
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_EMAIL=admin@mlsa.com
ADMIN_PASSWORD=admin123
```

## License

MIT
