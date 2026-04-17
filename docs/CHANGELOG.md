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

- Database schema successfully synced
- Core backend structure ready for feature development

## Day 3 — Menu Models

- Implemented `Category` and `MenuItem` models in Prisma schema
- Added relations: Restaurant → Category → MenuItem
- Introduced ordering and visibility fields (`sortOrder`, `isVisible`, `isSoldOut`)
- Standardized audit fields with `@default(now())` and `@updatedAt`
- Applied migration and synced database
- Inserted sample data via Prisma Studio
- Verified relations using SQL queries and JOINs

Status: Completed

## [2026-04-13] - [2026-04-15] — Week 1

## Day 4 — Order Models

### Added

- Implemented `CustomerOrder` model (order header)
- Implemented `CustomerOrderItem` model (order line items)
- Added order-related enums:
  - `OrderStatus`
  - `PaymentStatus`
  - `PrintStatus`

### Updated

- Connected relations:
  - `Restaurant` → `CustomerOrder`
  - `RestaurantTable` → `CustomerOrder`
  - `MenuItem` → `CustomerOrderItem`

### Design Decisions

- Introduced snapshot fields:
  - `menuNameSnapshot`
  - `unitPriceSnapshot`
- Added pricing structure:
  - `subtotal`
  - `discountAmount`
  - `totalAmount`
- Kept pricing as `Int` for initial consistency

### Validation

- Successfully created test order and order items
- Verified all relations across:
  - Restaurant ↔ Order
  - Table ↔ Order
  - Order ↔ OrderItem
  - MenuItem ↔ OrderItem
- Confirmed snapshot data remains unchanged after menu updates

### Result

- Order flow-ready database structure established

## Day 5 — Print Model

- Added `PrintJob` model and `PrintJobStatus` enum
- Connected `CustomerOrder` → `PrintJob` (1:N)
- Added retry and failure tracking fields
- Verified schema and relations via Prisma Studio and SQL

### Checking status changes

- Confirmed status separation using SQL join (`Order.printStatus` vs `PrintJob.status`)

## Day 6

- Current Prisma schema rechecked
- Existing database tables and relations reconfirmed
- Prisma Studio structure revalidated
- Migration state reviewed
- Ready for seed data setup
