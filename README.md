# QR Ordering System

A full-stack QR-based restaurant ordering system built with Next.js, TypeScript, Node.js, Express, PostgreSQL, and Prisma.

The project simulates a real restaurant ordering workflow where customers scan a table QR code, browse the restaurant menu, configure menu options, manage their cart, and submit an order that is validated and persisted by the backend.

The project is being developed with a production-oriented approach, focusing on clear frontend/backend responsibilities, server-side validation, database integrity, and maintainable application architecture.

---

## Features

### Customer Ordering

- QR-based restaurant and table entry
- Backend validation of restaurant and table information
- Category-based menu browsing
- Menu item detail pages
- Required and optional menu options
- Single and multiple option selection
- Sold-out menu handling
- Cart management
- Quantity controls
- Checkout and order summary
- Persistent order creation
- Backend-generated order number
- Order confirmation

### Admin Management

- Admin dashboard
- Category management interface
- Menu management interface
- Option group and option item management interface
- Required/optional option configuration
- Menu visibility and sold-out management

> Admin management currently uses the existing prototype UI and is being integrated with the backend CRUD APIs and PostgreSQL database.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- CSS Modules
- Context API

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM

### Database

- PostgreSQL

### Development Tools

- Git / GitHub
- Postman
- Prisma Studio
- VS Code

---

## Application Flow

The customer ordering flow follows the complete restaurant ordering lifecycle:

```text
QR Entry
   ↓
Restaurant / Table Validation
   ↓
Menu
   ↓
Menu Detail & Options
   ↓
Cart
   ↓
Checkout
   ↓
Backend Order Validation
   ↓
Order Creation
   ↓
Confirmation
```

## Backend Validation & Data Integrity

The backend acts as the final trust boundary for customer orders.

When an order is submitted, the frontend sends identifiers and quantities rather than trusted price values.

The backend:

- Validates the restaurant and table
- Verifies that the table belongs to the restaurant
- Validates menu item availability and sold-out status
- Validates selected option items and option group rules
- Validates item quantities
- Retrieves menu and option prices from the database
- Calculates unit prices, line totals, and the final order total server-side
- Stores order-time price and menu snapshots
- Persists the order and order items using a Prisma transaction

Client-side prices are used for UI display only and are not treated as authoritative order values.

---

## Frontend Architecture

The customer frontend separates UI, shared state, and backend communication.

```text
Customer Screens
      ↓
React Context
(Order Session / Cart)
      ↓
Frontend API Layer
      ↓
Backend REST API
```

### Order Session

`OrderSessionContext` maintains the currently validated restaurant and table throughout the ordering flow.

When a customer enters a different restaurant or table session, the previous cart is cleared to prevent order data from being shared between table sessions.

### Cart

`CartContext` manages:

- Cart items
- Selected options
- Quantities
- Client-side subtotals
- Client-side total price
- Cart item merging and removal

These calculations provide immediate UI feedback while the backend remains responsible for authoritative order pricing.

---

## Backend Architecture

The backend follows a lightweight Route → Service → Database structure.

```text
Express Route
     ↓
Service Layer
     ↓
Prisma
     ↓
PostgreSQL
```

Routes handle HTTP requests, basic request validation, and responses.

Services contain database access, business validation, relationship validation, pricing logic, and order persistence.

The architecture intentionally remains lightweight for the current project size while keeping business logic separated from HTTP handling.

---

## Database

The core database includes models for:

- Restaurants
- Restaurant Tables
- Categories
- Menu Items
- Option Groups
- Option Items
- Customer Orders
- Customer Order Items

Order records preserve snapshot data such as menu names, base prices, selected options, unit prices, and line totals so historical orders remain accurate even if menu data changes later.

---

## Current Development

The core database-backed customer ordering flow is complete.

Current development is focused on connecting the existing admin management interfaces to backend CRUD APIs and PostgreSQL.

Planned development includes:

- Admin Category CRUD integration
- Admin Menu CRUD integration
- Admin Option CRUD integration
- Menu and option relationship management
- Admin order management
- Deployment and production configuration

---

## Engineering Focus

This project is being developed as a practical full-stack application with emphasis on:

- Clear separation of frontend and backend responsibilities
- Server-side validation
- Secure handling of client-provided data
- Relational database design
- API-driven frontend architecture
- Transactional order persistence
- Maintainable TypeScript code
- Production-oriented code review and refactoring
