# Wood Product Services Website

This workspace contains:
- Next.js frontend in apps/web
- NestJS backend in apps/api
- Prisma schema in prisma/
- PostgreSQL via Docker Compose

## Quick start

1. Install dependencies:
   npm install
2. Start PostgreSQL:
   docker compose up -d
3. Generate Prisma client:
   npm run prisma:generate
4. Run the development servers:
   npm run dev
