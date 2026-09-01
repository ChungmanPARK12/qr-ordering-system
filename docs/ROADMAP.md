## Week 5 — Database & Backend API Integration

### Objective

Build the database and backend APIs for the existing ordering flow and begin replacing mock data with real server data.

---

## Day 1 — Database Schema & Prisma Setup(Completed)

### Goal

Define the core database structure for the ordering system.

### Tasks

- Review current mock data structure
- Define Prisma models and relationships:
  - Restaurant
  - Table
  - Category
  - MenuItem
  - OptionGroup
  - Option
- Configure PostgreSQL connection
- Create and run initial migration
- Verify Prisma Client connection

### Expected Output

- Core database schema created
- PostgreSQL connected through Prisma
- Initial migration completed

---

## Day 2 — Database Seed Data(Completed)

### Goal

Replace frontend-only mock restaurant/menu data with reusable database seed data.

### Tasks

- Create Prisma seed script
- Add demo restaurant and tables
- Add categories and menu items
- Add option groups and options
- Verify relationships and seeded records

### Expected Output

- Demo ordering data stored in PostgreSQL
- Database ready for API development

---

## Day 3 — Restaurant & Table APIs(Completed)

### Goal

Support QR entry validation using backend data.

### Tasks

- Add restaurant API
- Add table lookup API
- Validate restaurant/table relationship
- Handle active/inactive states
- Add basic API error handling
- Test endpoints

### Expected Output

- QR entry data available through backend APIs
- Restaurant/table validation moved toward server data

---

## Day 4 — Menu & Option APIs

### Goal

Serve the complete customer menu from the backend.

### Tasks

- Add category API
- Add menu item API
- Include option groups and options
- Preserve visibility, sold-out, and sorting rules
- Test API response structure

### Expected Output

- Customer menu data available from backend
- Menu relationships returned correctly

---

## Day 5 — Customer Frontend API Integration

### Goal

Replace customer-side mock menu data with backend API data.

### Tasks

- Connect QR Entry to restaurant/table APIs
- Connect Menu List to backend data
- Connect Menu Detail and options
- Add loading and API error states
- Preserve existing ordering behavior

### Expected Output

- Customer flow reads restaurant/menu data from PostgreSQL
- Core mock-data dependency removed from customer flow

---

## Day 6 — Order Database & Order API

### Goal

Store completed customer orders in the database.

### Tasks

- Define Order and OrderItem models
- Store selected options and quantities
- Add order creation API
- Generate backend order number
- Return created order data to frontend
- Connect Checkout → Order Confirmation

### Expected Output

- Orders persisted in PostgreSQL
- Confirmation uses real backend order data

---

## Day 7 — Backend Integration Review

### Goal

Verify the complete database-backed ordering workflow.

### Tasks

Test:

QR Entry
→ Menu
→ Menu Detail
→ Cart
→ Checkout
→ Create Order
→ Confirmation

Review:

- API responses
- database relationships
- validation
- loading/error states
- totals and selected options
- order persistence
- frontend behavior

### Expected Output

- Customer ordering flow connected to backend
- Core database and APIs verified
- Project ready for admin CRUD integration

---

## Week 5 — Definition of Done

- PostgreSQL and Prisma connected
- Core restaurant/menu schema implemented
- Seed data available
- Restaurant, table, menu, and option APIs working
- Customer flow uses backend data
- Orders stored in database
- Confirmation uses backend-created order data
- Existing ordering logic remains intact
- Backend foundation ready for admin CRUD
