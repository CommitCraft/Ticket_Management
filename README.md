# Enterprise Helpdesk & Ticket Management System

Monorepo for a production-ready MERN ticket management platform with TypeScript, JWT auth, refresh tokens, RBAC, ticket workflows, reporting, and responsive dashboards.

## Structure

- `backend/` Express + MongoDB API
- `frontend/` React + Vite application

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. Run in development:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
```

## Seed Data

```bash
npm run seed
```

## Docker

Use `docker-compose.yml` to run the API, web app, and MongoDB together.
# Ticket_Management
