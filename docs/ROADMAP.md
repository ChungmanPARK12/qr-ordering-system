## Week 6 — Admin CRUD API Integration

### Objective

Connect the existing admin management prototype to the backend and PostgreSQL database.

Replace admin-side mock CRUD operations with real APIs while preserving the existing admin UI and establishing a reusable frontend → API → backend → database integration pattern.

---

## Day 1 — Admin Architecture Review & Category CRUD

### Goal

Establish the admin backend integration pattern and connect category management to PostgreSQL.

### Tasks

- Review existing Admin feature structure and mock CRUD flow
- Review current Admin authentication / access structure
- Review existing mock data dependencies
- Define Admin API layer structure
- Define Admin request/response types
- Establish restaurant ownership validation rules for Admin APIs
- Review category deletion relationship behavior
- Add Category CRUD routes and service logic
- Connect `CategoryManagement` to backend APIs
- Add loading and error handling
- Verify persisted changes in Prisma Studio/PostgreSQL

### Expected Output

- Admin integration architecture established
- Category CRUD works end-to-end
- Restaurant-scoped validation pattern established
- Existing Category mock dependency removed

---

## Day 2 — Menu Item CRUD Integration

### Goal

Connect menu item management to backend APIs and PostgreSQL.

### Tasks

- Add Menu Item CRUD routes
- Add Menu Item service logic
- Validate restaurant and category relationships
- Support menu item fields:
  - name
  - description
  - price
  - image URL
  - visibility
  - sold-out status
  - sorting/order fields if currently supported
- Connect `MenuManagement` to backend APIs
- Replace mock menu mutations
- Verify category/menu relationships
- Test create, update, and delete flows

### Expected Output

- Menu items managed through PostgreSQL
- Admin Menu Management uses real backend data
- Visibility and sold-out state persist correctly

---

## Day 3 — Option Group & Option Item CRUD

### Goal

Connect the existing option management system to the backend.

### Tasks

- Add Option Group CRUD APIs
- Add Option Item CRUD APIs
- Add service logic for option relationships
- Support:
  - required / optional configuration
  - minSelection
  - maxSelection
  - additionalPrice
  - single / multiple selection rules
- Validate option group constraints
- Validate option item ownership
- Connect `OptionManagement` to backend APIs
- Replace mock option mutations
- Verify persisted option configuration

### Expected Output

- Option groups and option items managed through PostgreSQL
- Existing option behavior preserved
- Admin option configuration works end-to-end

---

## Day 4 — Menu ↔ Option Assignment Integration

### Goal

Complete the relationships between menu items and option groups.

### Tasks

- Review current Prisma relationship between MenuItem and OptionGroup
- Add API/service logic for assigning option groups to menu items
- Support adding and removing option groups from menu items
- Prevent invalid or cross-restaurant relationships
- Connect menu-option assignment UI to backend data
- Verify assigned options appear correctly in Customer Menu Detail
- Review delete/dependency behavior for related records
- Verify existing customer orders remain unaffected

### Expected Output

- Admin can configure options for individual menu items
- Menu/option relationships persist correctly
- Customer Menu Detail reflects admin configuration

---

## Day 5 — Weekly UML & Architecture Review

### Goal

Review and document the architecture implemented during Weeks 5–6.

### Tasks

#### Weekly Recap

- Review completed database and API work
- Review customer and admin integration flows
- Review important architectural decisions

#### Architecture Review

Review responsibilities of:

- Frontend Screens
- React Context
- Frontend API Layer
- Express Routes
- Services
- Prisma
- PostgreSQL

#### UML Update

Update or create:

- Level 1 — System Context
- Level 2 — Frontend / Backend Package Architecture
- Level 3 — Key implementation flows

Create or update Sequence Diagrams for:

- QR Entry validation
- Customer order creation
- Admin category CRUD
- Admin menu CRUD

#### Trust Boundary Review

Review:

- Frontend UX validation
- Backend request validation
- Business rule validation
- Restaurant ownership validation
- Database authority
- Client-side vs server-side pricing

#### Interview Review

Practice explaining:

- Why Context is used
- Why frontend API functions are separated
- Route vs Service responsibilities
- Why backend validation is authoritative
- How Prisma connects services to PostgreSQL

### Expected Output

- Current system architecture documented
- Major frontend/backend flows visually understood
- UML documentation synchronized with actual code
- Architecture ready to explain in an interview

---

## Day 6 — Admin CRUD Integration Testing

### Goal

Verify the complete admin → database → customer flow.

### Tasks

Test:

Category Create / Update / Delete

→ Menu Create / Update / Delete

→ Option Group / Option Item Management

→ Menu / Option Assignment

→ Customer Menu

→ Menu Detail

Review:

- API request/response structures
- database relationships
- restaurant ownership validation
- validation
- error handling
- loading states
- deleted/hidden records
- sold-out behavior
- option configuration

Verify that admin changes are correctly reflected in the customer ordering flow.

### Expected Output

- Admin CRUD flow verified end-to-end
- Customer menu reflects database changes correctly
- Core admin mock-data dependency removed

---

## Day 7 — Production Code Review & Cleanup

### Goal

Review the newly integrated admin CRUD implementation before moving to the next feature area.

### Tasks

Review using:

- Correctness
- Responsibility
- Type Safety
- Validation & Security
- Duplication
- Error Handling
- Maintainability
- Scalability
- Overengineering
- Testability

Review:

- Admin API layer
- Admin screens
- Backend routes
- Services
- Prisma queries
- Relationship validation

Classify findings as:

- Production Ready
- Future Improvement
- Production Blocker

Perform only necessary refactoring.

Update CHANGELOG and project documentation.

### Expected Output

- Admin CRUD integration reviewed
- Important risks resolved
- Future improvements documented
- Week 6 ready to close

---

## Week 6 — Definition of Done

- Admin category management uses backend APIs
- Admin menu management uses backend APIs
- Option groups and option items use backend APIs
- Menu-option relationships persist in PostgreSQL
- Admin changes are reflected in the customer ordering flow
- Core admin mock-data dependency removed
- Restaurant ownership and relationship validation verified
- Delete/dependency behavior reviewed
- Weekly UML documentation updated
- Production Code Review completed
- No production blockers remain