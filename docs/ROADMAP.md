# QR Restaurant Ordering System — Roadmap

## Week 1 — Foundation & Environment Setup

### Objective

Establish a stable development environment and project structure that allows immediate feature development.

#### 1. Project Initialization

- Created root project structure:
  - client/
  - server/
  - docs/
- Initialized Next.js app (client)
- Initialized Node.js + Express backend (server)

---

#### 2. Frontend Setup (Next.js)

- Next.js (App Router + TypeScript) initialized
- Tailwind CSS configured
- Project runs successfully

---

#### 3. Backend Setup (Express + TypeScript)

- Express server initialized
- Middleware configured:
  - cors
  - helmet
  - morgan
- Basic `/health` endpoint implemented
- Server successfully running on port 4000

---

#### 4. TypeScript Configuration

- Resolved module system conflicts
- Configured:
  - module: Node16
  - moduleResolution: node16
- Fixed compilation errors

---

#### 5. Prisma Initialization

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

### Next Step (Week 2 Preview)

## Week 2 — Database Design & Core Models

Planned tasks:

- Design Prisma schema
- Implement core models:
  - Restaurant
  - AdminUser
  - RestaurantTable
  - Category
  - MenuItem
  - CustomerOrder
  - CustomerOrderItem
  - PrintJob
- Run initial migration
- Seed test data

---

### Notes

- Current database is empty (expected state)
- `prisma db pull` error is expected due to no tables
- Next step is schema-first approach (NOT introspection)

---

### End of Week 1 Definition of Done

- Development environment fully set up
- Server and client running independently
- Database connection established
- Ready to start feature implementation
