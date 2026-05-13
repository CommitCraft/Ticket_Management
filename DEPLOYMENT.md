# Deployment Guide

## Prerequisites

- Node.js 20+
- MongoDB 7+
- SMTP account for outgoing email

## Environment Variables

Copy the examples and fill in production values:

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

## Local Development

```bash
npm install
npm run seed
npm run dev
```

## Docker Compose

```bash
docker compose up --build
```

This starts:

- MongoDB on `27017`
- Backend API on `5000`
- Frontend on `3000`

## Production Notes

- Put the frontend behind an HTTPS reverse proxy.
- Set `FRONTEND_URL` to the deployed frontend origin.
- Set `NODE_ENV=production` so auth cookies are secure.
- Use a managed MongoDB deployment and back up the database regularly.
- Configure SMTP credentials before enabling password reset workflows.

## Seed Account

The seed script creates a super admin account:

- Email: `admin@helpdesk.local`
- Password: `Admin@12345`

Change this immediately after first login.