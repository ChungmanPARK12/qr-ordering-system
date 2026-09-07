### Week 5 — Day 1: Database Schema & Prisma Setup

- Defined core Prisma models and relationships
- Added menu option database structure
- Connected PostgreSQL and applied initial migration
- Configured Prisma Client with PostgreSQL adapter
- Verified database connection with a test query

### Week 5 — Day 2: Database Seed Data

- Updated Prisma seed data to match frontend mock data
- Added restaurant, tables, categories, and menu items
- Added option groups and option items
- Connected menu items with option groups
- Verified seeded data and relationships in Prisma Studio

### Week 5 — Day 3: Restaurant & Table APIs

- Added Restaurant and Table APIs
- Added QR entry validation endpoint
- Added active/inactive and relationship validation
- Added basic API error handling
- Verified valid and invalid QR cases

### Week 5 — Day 4: Menu & Option APIs

- Added category and menu APIs
- Added menu detail API with option groups and items
- Added visibility, sold-out, and sorting rules
- Verified menu relationships and API responses

### Week 5 — Day 5: Customer Frontend API Integration

- Connected QR Entry to backend API
- Connected Menu List and Menu Detail to backend data
- Removed customer-flow dependency on mock menu data
- Added loading and API error states
- Verified full customer ordering flow

#### Debugging & Testing

- **Direct Route & API Testing**
  - Tested backend API routes directly using endpoint URLs
  - Verified request parameters and JSON responses
  - Confirmed valid and invalid API response behavior

- **Database-to-Frontend Verification**
  - Temporarily changed restaurant and menu data in Prisma Studio
  - Confirmed PostgreSQL changes were reflected correctly in the customer UI
  - Restored test data after verification

- **API Integration Testing**
  - Verified QR validation through the backend API
  - Verified Menu List data loaded from PostgreSQL
  - Verified Menu Detail, option groups, and option items loaded from the backend

- **State & Calculation Testing**
  - Verified option selection and quantity behavior after API integration
  - Confirmed option prices and subtotals remained correct
  - Verified API-loaded menu data was preserved when added to the cart

- **End-to-End Testing**
  - Verified the complete customer flow:
    `QR Entry → Menu → Menu Detail → Cart → Checkout → Confirmation`

### Week 5 — Day 6: Order Database & Order API

- Added order item snapshot fields
- Added order creation API with server-side validation
- Added backend price calculation and Prisma transaction
- Connected Checkout to real order creation
- Verified multi-item orders and PostgreSQL persistence

#### Debugging & Testing

- **TypeScript Error Analysis**
  - Identified and fixed the implicit `any[]` type issue in `preparedItems`
  - Used the exact compiler error message to isolate the root cause

- **API Isolation Testing**
  - Tested `POST /api/orders` independently with `curl`
  - Verified backend order creation before frontend integration

- **Response & Calculation Validation**
  - Verified backend-generated order numbers
  - Compared menu, option, quantity, subtotal, and total calculations

- **Database Verification**
  - Inspected `CustomerOrder` and `CustomerOrderItem` using Prisma Studio
  - Verified relationships, price snapshots, quantities, and selected option JSON

- **Scenario & Edge-Case Testing**
  - Tested single and multiple order items
  - Tested different menu and option combinations
  - Verified items with and without options

- **End-to-End Testing**
  - Verified the complete customer flow:
    `QR Entry → Menu → Menu Detail → Cart → Checkout → Order API → PostgreSQL → Confirmation`

### Week 5 — Day 7: Backend Integration Review

- Verified the complete database-backed customer ordering flow
- Reviewed QR, menu, option, and order APIs
- Verified database relationships and order persistence
- Verified frontend loading and error states
- Confirmed backend totals and selected option snapshots
- Completed Week 5 Definition of Done

#### Debugging & Testing

- **End-to-End Regression Testing**
  - Verified the full flow from QR Entry to Order Confirmation
  - Confirmed frontend totals matched persisted backend order data

- **Direct API Testing**
  - Tested API routes directly through browser endpoints and `curl`
  - Verified valid and invalid QR, menu, option, and order requests

- **Database Verification**
  - Inspected orders and order items using Prisma Studio
  - Verified relationships, price snapshots, selected options, and totals

- **Edge-Case Testing**
  - Identified duplicate option IDs causing incorrect price calculation
  - Added server-side duplicate option validation
  - Identified invalid quantity values reaching Prisma as `NaN`
  - Added order item input type validation

- **Regression Retesting**
  - Repeated failed API requests after fixes
  - Confirmed duplicate options and invalid quantities are now rejected

  ### Refactoring Preparation & Functional Retest

- Started refactoring preparation after completing frontend–backend integration
- Identified duplicated and inconsistent frontend type definitions during the initial refactoring review
- Centralized shared customer-side types under `src/types`
- Replaced local/duplicated types and rechecked frontend–backend type contracts
- Retested the complete customer ordering workflow after type consolidation:
  - QR restaurant/table validation
  - Menu and menu detail loading
  - Option selection and price calculation
  - Cart and checkout flow
  - Order creation and confirmation
- Verified `CustomerOrder` and `CustomerOrderItem` persistence in PostgreSQL
- Retested exception cases:
  - Invalid restaurant
  - Invalid table
  - Missing order session
  - Sold-out menu interaction
- Confirmed direct navigation/refresh currently resets the in-memory order session
- Established a stable functional baseline before refactoring

### Next

- Production code review
- Identify and prioritize refactoring targets

### Production Code Review — QR Entry

- Started production code review with the customer QR entry flow
- Reviewed QR validation, loading, error handling, and order session setup
- Confirmed backend validation remains the final trust boundary for restaurant/table data
- Reviewed async request cancellation guard and session state flow
- Identified frontend message-based error matching as a future improvement
  - Backend already provides structured error codes
  - Keep current implementation until error-specific behavior requires structured frontend errors
- Reviewed `OrderSessionContext` and confirmed the current Context-based session structure is appropriate
- Noted that order session is currently memory-only and resets on refresh/direct navigation

### Next

- Continue production code review from the customer menu flow
