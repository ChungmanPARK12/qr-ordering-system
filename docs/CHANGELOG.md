## [2026-04-06] - [2026-04-10] — Week 1

### Summary

Project initialization and environment setup completed.

### Changes

- Created project structure: client / server / docs
- Initialized Next.js frontend (TypeScript, App Router, Tailwind)
- Initialized Express backend (TypeScript)
- Implemented basic server with `/health` endpoint
- Configured TypeScript (Node16 module resolution)
- Installed and initialized Prisma
- Created PostgreSQL database (qr_order_system)
- Connected Prisma to database

### Status

- Client running
- Server running
- Database connected

## Day 2: Core Store Models

### Completed

- Defined core models: `Restaurant`, `AdminUser`, `RestaurantTable`
- Established relationships between entities (1:N structure)
- Added enums: `AdminRole`, `TableStatus`
- Applied constraints (unique keys, indexes, relations)

### Database

- Configured Prisma v7 (`prisma.config.ts`)
- Fixed datasource configuration (moved `DATABASE_URL` to config)
- Resolved TypeScript + Node type issues
- Ran migration: `init_core_models`
- Verified tables via Prisma Studio and `psql`

### Result

- Database schema successfully syncedd
- Core backend structure ready for feature development
