# Wood Product Services Website

## Overview

This project is a full-stack web application developed as part of the Pixel38 Technical Assessment.

The application consists of:

- A public website for showcasing wood products and services.
- An administrator dashboard (CMS) for managing website content.
- Secure authentication using JWT.
- REST API built with NestJS.
- PostgreSQL database managed with Prisma ORM.

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer (Image Upload)

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

---

# Project Structure

```
apps/
│
├── web/
│   ├── app/
│   ├── components/
│   └── public/
│
├── api/
│   ├── src/
│   ├── auth/
│   ├── services/
│   ├── homepage/
│   ├── products/
│   ├── price-groups/
│   └── site-content/
│
prisma/
├── schema.prisma
├── migrations/
└── seed-admin.js
```

---

# Setup Instructions

Clone the repository:

```bash
git clone https://github.com/malikitanibey-hub/wood-product-services-website.git
cd wood-product-services-website
```

Install dependencies:

```bash
npm install
```

Create a root `.env` file using the variables listed below.

Generate Prisma Client:

```bash
npx prisma generate
```

For local development, apply the migrations:

```bash
npx prisma migrate dev
```

Seed the administrator account:

```bash
npx prisma db seed
```

Start the backend:

```bash
npm run dev --workspace apps/api
```

Start the frontend in another terminal:

```bash
npm run dev --workspace apps/web
```

---

# Environment Variables

## Backend — root `.env`

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/wood_products?schema=public"

JWT_ACCESS_SECRET="your_secure_access_token_secret"
JWT_REFRESH_SECRET="your_secure_refresh_token_secret"

JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

PORT=4000
WEB_ORIGIN="http://localhost:3000"

ADMIN_EMAIL="your_admin_email"
ADMIN_PASSWORD="your_admin_password"
```

Never commit the real `.env` file or production credentials.

## Frontend environment variables

```env
NEXT_PUBLIC_API_URL="/backend"
SERVER_API_URL="https://wood-product-services-website.onrender.com/api"
```

For local frontend development, `NEXT_PUBLIC_API_URL` may instead point directly to:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

---

# Database Setup

The project uses PostgreSQL through Prisma ORM.

For local development:

```bash
npx prisma migrate dev
```

For production deployment:

```bash
npx prisma migrate deploy
```

Create or update the administrator account:

```bash
npx prisma db seed
```

The seed requires `ADMIN_EMAIL` and an `ADMIN_PASSWORD` containing at least 12 characters.

---
# Architecture Overview

The project follows a monorepo architecture.

Frontend:
- Next.js (App Router)
- React
- Tailwind CSS

Backend:
- NestJS REST API
- Prisma ORM
- PostgreSQL

Authentication:
- JWT access and refresh tokens
- HTTP-only cookies

Deployment:
- Frontend hosted on Vercel
- Backend hosted on Render
- PostgreSQL hosted on Render

# Features

## Public Website

- Homepage
- Gallery
- Products
- Services
- Price List
- About
- Contact
- Login

## Administrator Dashboard

- Homepage CMS
- Services Management
- Price Groups Management
- Products Management
- About CMS
- Contact CMS
- Login Page CMS
- Image Upload
- Authentication

# Deployment

- Public website and CMS:  
  `https://wood-product-services-website-web.vercel.app`

- Backend API:  
  `https://wood-product-services-website.onrender.com`

- Swagger API documentation:  
  `https://wood-product-services-website.onrender.com/api/docs`

- Database: Render PostgreSQL

The administrator credentials are provided separately in the assessment submission email.

---

# AI Tools Used

The following AI-assisted development tools were used:

- ChatGPT
- Codex
- OpenCode
- Github Copilot

AI assistance was used for:

- Implementation planning
- Debugging
- Code refactoring
- API documentation
- Deployment troubleshooting
- Responsive layout improvements

All generated code was reviewed, tested, and adapted to the project.

---

# Time Spent

Approximately **36 hours**.

---

# Known Limitations

Due to the short assessment timeframe, core functionality was prioritized.

Known limitations:

- Minor responsive improvements remain on some administrator CMS pages.
- Uploaded files currently use server filesystem storage. A production version should use persistent cloud storage such as Cloudinary, Amazon S3, or Supabase Storage.

# Author

Malek Itani

Email:

Malikitani.bey@gmail.com

GitHub:

https://github.com/malikitanibey-hub

LinkedIn:

https://www.linkedin.com/in/malekitani
