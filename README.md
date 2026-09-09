# QR Ordering System

A full-stack QR-based restaurant ordering system built with **Next.js, TypeScript, Node.js, Express, PostgreSQL, and Prisma**.

The project simulates a real restaurant ordering workflow where customers scan a table QR code, browse the restaurant menu, configure menu options, manage their cart, and submit an order that is **validated and persisted by the backend**.

The project is being developed with a **production-oriented approach**, focusing on clear frontend/backend responsibilities, **server-side validation, database integrity, and maintainable application architecture**.

---

## Features

### Customer Ordering

- QR-based restaurant and table ordering
- Category-based menu browsing with menu options
- Sold-out and menu availability handling
- Cart, quantity, and option management
- Checkout with server-validated order creation
- Persistent orders with backend-generated order confirmation

### Admin Management

- Admin dashboard
- Category and menu management
- Option group and option item management
- Menu visibility and sold-out management

> Admin management is currently being integrated with backend CRUD APIs and PostgreSQL.

---

## Application Flow

The customer ordering flow covers the complete restaurant ordering lifecycle:

`QR Entry` → `Restaurant / Table Validation` → `Menu` → `Menu Detail & Options` → `Cart` → `Checkout` → `Backend Order Validation` → `Order Creation` → `Confirmation`

Customer menu and restaurant data are retrieved from PostgreSQL through backend APIs rather than frontend mock data.

---

## Backend Validation & Data Integrity

Customer orders are validated and priced on the server rather than trusting client-side values.

- Validates restaurant, table, menu, option, and quantity data
- Recalculates menu and option prices using database values
- Enforces sold-out and option selection rules
- Stores order-time price snapshots
- Persists orders using Prisma transactions

---

## Architecture

The application separates the Next.js frontend from the Express backend through a dedicated API layer.

- **Frontend:** Next.js, React, TypeScript, Context API
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **API:** REST-based communication between client and server

Backend services handle business validation, database access, pricing, and order persistence, while the frontend focuses on the customer and admin interfaces.

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

---
