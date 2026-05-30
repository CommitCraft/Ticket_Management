# Enterprise Helpdesk & Ticket Management System

A MERN-based helpdesk platform for managing tickets, assignments, replies, notifications, audit logs, reports, and role-based access.

## Tech Stack

- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose
- Frontend: React, Vite, TypeScript, Tailwind CSS
- Auth and security: JWT, refresh tokens, RBAC, Helmet, CORS, rate limiting
- Integrations: email, WhatsApp, file uploads, socket notifications, export/reporting

## Project Structure

- `backend/` Express API, database models, controllers, services, validators, uploads
- `frontend/` React UI, routing, pages, layouts, store, services, components
- `docker-compose.yml` Local Docker setup for MongoDB, backend, and frontend

## Requirements

- Node.js 18+ recommended
- npm
- MongoDB running locally or through Docker

## Environment Setup

Copy the sample env files and fill in the values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Backend env keys:

- `PORT`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `FRONTEND_URL`
- `SUPER_ADMIN_NAME`
- `SUPER_ADMIN_EMAIL`
- `SUPER_ADMIN_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `WHATSAPP_API_URL`
- `WHATSAPP_ID_INSTANCE`
- `WHATSAPP_API_TOKEN_INSTANCE`
- `WHATSAPP_GROUP_ID`
- `HOST`
- `ALLOW_ALL_ORIGINS`
- `NODE_ENV`

Frontend env keys:

- `VITE_API_URL`

## Install

```bash
npm install
```

## Development

Run both apps together:

```bash
npm run dev
```

Local URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Available Scripts

Root:

- `npm run dev` - run backend and frontend together
- `npm run build` - build backend and frontend
- `npm run lint` - lint backend and frontend
- `npm run typecheck` - typecheck backend and frontend
- `npm run seed` - seed backend data

Backend:

- `npm run dev --workspace backend`
- `npm run build --workspace backend`
- `npm run start --workspace backend`
- `npm run lint --workspace backend`
- `npm run typecheck --workspace backend`
- `npm run seed --workspace backend`

Frontend:

- `npm run dev --workspace frontend`
- `npm run build --workspace frontend`
- `npm run preview --workspace frontend`
- `npm run lint --workspace frontend`
- `npm run typecheck --workspace frontend`

## Seed Data

Create the initial admin and sample data:

```bash
npm run seed
```

## Docker

Start MongoDB, backend, and frontend together:

```bash
docker compose up --build
```

Ports used by Docker:

- MongoDB: `27017`
- Backend: `5000`
- Frontend: `3000`

## Main Features

- Ticket creation, assignment, replies, and status tracking
- Notifications and audit logs
- Role-based access control
- Reports and dashboard views
- File and image uploads
- Mobile-friendly UI with a shared shell layout

## Notes

- The backend expects a valid MongoDB URI and JWT secrets before startup.
- The frontend expects `VITE_API_URL` to point to the backend API.
- Default super admin credentials are controlled by the backend env values.
