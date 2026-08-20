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

## [2026-04-21] - [2026-04-25] Week 2 — Day 7

### Changes

- Added `prisma/seed.ts`
- Implemented seed data (Restaurant, AdminUser, Table, Category, MenuItem)
- Fixed Prisma Client generation & import issues
- Applied Prisma 7 PostgreSQL adapter
- Reset DB and executed seed successfully

### Result

- Database ready for development

## [2026-08-17] - Week3 Day 1

### Admin Structure and Navigation Setup

- Set up admin routes for dashboard, categories, menus, and options.
- Connected admin pages with feature components.
- Added admin navigation links and verified routing.
- Defined Category and MenuItem client types based on Prisma schema.
- Added mock category and menu data for upcoming UI development.

## [2026-08-18] - Week3 Day 2

### Category and Menu management

- Added mock category list UI.
- Added category create, edit, and delete functionality.
- Added category visibility toggle.
- Implemented category management using client-side mock state.

### Category & Menu Management

- Added category and menu CRUD using mock data.
- Added category selection, visibility, and sold-out controls.
- Added menu image placeholder.
- Verified admin management flow.

## [2026-08-19] — Week 3 Day 3

### Menu Options System

- Added OptionGroup and OptionItem types and mock data.
- Implemented option group and option item CRUD.
- Added single/multiple and min/max selection settings.
- Added additional price handling for option items.
- Implemented menu item and option group assignment.

## [2026-08-20] — Week 3 Day 4

### QR Entry & Table Context

- Added customer QR entry flow with restaurant and table parameters.
- Added restaurant and table validation.
- Implemented OrderSessionContext for table session state.
- Added Start Order flow and session-based menu access.
- Added invalid and missing session handling.
