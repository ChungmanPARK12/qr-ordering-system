# QR Restaurant Ordering System — Roadmap

## Week 1 — Foundation & Environment Setup

### Objective

Establish a stable development environment and project structure that allows immediate feature development.

#### 1. Project Initialization(Finished)

- Created root project structure:
  - client/
  - server/
  - docs/
- Initialized Next.js app (client)
- Initialized Node.js + Express backend (server)

---

#### 2. Frontend Setup (Next.js)(Finished)

- Next.js (App Router + TypeScript) initialized
- Tailwind CSS configured
- Project runs successfully

---

#### 3. Backend Setup (Express + TypeScript)(Finished)

- Express server initialized
- Middleware configured:
  - cors
  - helmet
  - morgan
- Basic `/health` endpoint implemented
- Server successfully running on port 4000

---

#### 4. TypeScript Configuration(Finished)

- Resolved module system conflicts
- Configured:
  - module: Node16
  - moduleResolution: node16
- Fixed compilation errors

---

#### 5. Prisma Initialization(Finished)

- Prisma installed and initialized
- `schema.prisma` created
- `.env` configured with DATABASE_URL

---

#### 6. PostgreSQL Connection

- PostgreSQL database created:
  - qr_order_system
- Prisma successfully connected to database
- Verified connection using `prisma db pull`

---

### Key Decisions (Locked)

- QR code includes table identification
- Real-time admin dashboard required (WebSocket)
- Print flow: Admin-triggered → device output
- Database must support future analytics:
  - daily revenue
  - monthly revenue
  - menu-level statistics
- Order snapshot data must be stored

---

### Current Status

- Backend: Running
- Frontend: Running
- Database: Connected
- Schema: Not yet implemented

---

## Week 2 — Database Design & Core Models

### Objective

Design a scalable and extensible database structure supporting QR ordering, admin operations, printing workflow, and future analytics.

---

## Day 1 — Schema Strategy & Entity Mapping(Comleted)

### Goal

Define the full database structure conceptually before implementation.

### Tasks

- Identify core entities
- Define responsibility of each entity
- Draft relationships between entities
- Define order snapshot strategy
- Consider future analytics requirements

### Expected Output

- Entity map
- Relationship draft
- Design notes

---

## Day 2 — Core Store Models(Completed)

### Goal

Implement base entities for restaurant and admin structure.

### Tasks

- Define `Restaurant`
- Define `AdminUser`
- Define `RestaurantTable`
- Establish relations between entities
- Define base fields and constraints

### Expected Output

- Prisma schema (Part 1)
- Core relations validated

---

## Day 3 — Menu Models(Completed)

### Goal

Design menu-related structure.

### Tasks

- Define `Category`
- Define `MenuItem`
- Add menu metadata (price, description, image)
- Define ordering and visibility fields
- Link menu to restaurant and category

### Expected Output

- Prisma schema (Part 2)
- Menu structure finalized

---

## Day 4 — Order Models(Completed)

### Goal

Design order processing structure.

### Tasks

- Define `CustomerOrder`
- Define `CustomerOrderItem`
- Add order status fields
- Add payment status fields
- Add print status fields
- Implement snapshot fields (menu name, price)
- Define total calculation structure

### Expected Output

- Prisma schema (Part 3)
- Order flow-ready structure

---

## Day 5 — Print Model & Audit Fields(Completed)

### Goal

Support printing workflow and tracking.

### Tasks

- Define `PrintJob`
- Add print status tracking
- Add retry and failure handling fields
- Define relation with orders and admin actions
- Standardize audit fields (`createdAt`, `updatedAt`)

### Expected Output

- Prisma schema (Part 4)
- Print-ready data structure

---

## Day 6 — Migration & Database Reflection

### Goal

Apply schema to actual database.

### Tasks

- Validate Prisma schema
- Run initial migration
- Verify tables in database
- Verify using Prisma Studio

### Expected Output

- Initial migration completed
- Physical database tables created

---

## Day 7 — Seed Data Setup

### Goal

Prepare initial dataset for development and testing.

### Tasks

- Define seed strategy
- Create sample restaurant
- Create sample admin user
- Create sample tables
- Create sample categories and menu items
- Execute seed script

### Expected Output

- Testable dataset available
- Ready for feature development

---

## Week 2 — Definition of Done

- Prisma schema fully implemented
- Core models created
- Migration successfully applied
- Database verified via Prisma Studio
- Seed data inserted
- System ready for feature development

---
