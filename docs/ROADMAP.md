## Week 4 — UI Polish & Responsive Customer Experience

### Objective

Polish the existing QR ordering prototype into a clean and consistent service-like interface before backend integration.

The goal is to keep the existing ordering logic unchanged while improving visual consistency, usability, responsive behavior, and overall product quality.

Main focus:

- Customer ordering flow
- Shared visual styles
- Mobile-friendly layouts
- Clear interaction states
- Consistent admin/customer UI structure

---

## Day 1 — Design System & Shared UI Foundation(Completed)

### Goal

Define the basic visual rules that will be reused across the ordering system.

### Tasks

- Define primary UI colors:
  - primary accent
  - background
  - text
  - muted text
  - border
  - disabled / sold-out state

- Define common layout rules:
  - page width
  - mobile padding
  - max-width
  - section spacing
  - card spacing

- Define typography hierarchy:
  - page title
  - section title
  - menu title
  - body text
  - price
  - helper text

- Define common UI patterns:
  - primary button
  - secondary button
  - destructive button
  - cards
  - input fields
  - radio / checkbox controls
  - quantity controls

- Review `globals.css`
- Decide which styles should be:
  - global
  - CSS Module
  - shared component styles

### Expected Output

- Base visual theme established
- Shared spacing and typography rules defined
- Common button/card/input styles ready for reuse

---

## Day 2 — QR Entry Screen Polish(Completed)

### Goal

Turn the QR entry page into a clean customer landing screen.

### Tasks

- Polish `/order` QR entry screen
- Display restaurant branding area
- Improve restaurant information layout
- Improve table information display
- Add clear Start Order button
- Improve validation/error screens:
  - Invalid QR
  - Restaurant not found
  - Table not found
  - Table unavailable
  - Restaurant unavailable

- Create consistent success/error page layout
- Add mobile-friendly spacing and sizing

### Expected Output

- QR entry screen looks like a real customer-facing service
- Invalid QR states are visually clear
- Start Order action is prominent

---

## Day 3 — Menu List Screen Polish(Completed)

### Goal

Create a clean and easy-to-browse restaurant menu experience.

### Tasks

- Refine restaurant/table header
- Improve category section layout
- Improve category typography
- Refine menu item cards
- Improve image placeholder
- Improve menu name / description / price layout
- Add hover / active states where appropriate
- Improve sold-out presentation
- Add clear visual separation between categories
- Keep responsive card width
- Add reasonable desktop max-width
- Review empty category state

### Expected Output

- Menu list looks like a production-style restaurant ordering screen
- Categories and menu items are easy to scan
- Sold-out items are immediately recognizable

---

## Day 4 — Menu Detail & Option Selection Polish(Completed)

### Goal

Improve usability of menu configuration and option selection.

### Tasks

- Polish menu detail layout
- Improve menu image / placeholder section
- Improve item name, description, and base price hierarchy

- Style OptionGroup sections:
  - required indicator
  - optional indicator
  - min/max selection hints

- Improve radio controls
- Improve checkbox controls
- Improve selected states
- Improve validation error messages

- Style quantity controls:
  - minus button
  - quantity value
  - plus button

- Make subtotal visually prominent
- Style Add to Cart button
- Add spacing between option groups

### Expected Output

- Customers can configure menu items clearly
- Required options and validation states are easy to understand
- Quantity and subtotal controls look service-ready

---

## Day 5 — Cart Screen Polish(Completed)

### Goal

Create a clear and usable shopping cart experience.

### Tasks

- Improve cart page header
- Display restaurant/table context cleanly
- Create Cart Item card layout
- Group selected options visually
- Improve quantity controls
- Style Remove action
- Improve unit price / subtotal display
- Make total price prominent
- Style Proceed to Checkout button
- Improve empty cart state
- Add Continue Ordering navigation if useful

### Expected Output

- Cart items are easy to review and modify
- Different option configurations are visually distinguishable
- Total and checkout action are clear

---

## Day 6 — Checkout & Order Confirmation Polish(Completed)

### Goal

Finish the visual customer ordering journey.

### Tasks

#### Checkout

- Improve order information section
- Improve order summary cards
- Display options and quantities clearly
- Emphasize final total
- Style Place Order button
- Improve empty checkout state

#### Confirmation

- Create clear order success state
- Display confirmation icon / visual area
- Highlight order number
- Display:
  - restaurant
  - table
  - total amount

- Improve confirmation message
- Add clear final action if needed:
  - Return to Menu
  - Start New Order

### Expected Output

- Checkout feels like a final review screen
- Order confirmation clearly communicates successful ordering
- Full customer flow has consistent styling

---

## Day 7 — Responsive Review, Admin Cleanup & Full UI Audit

### Goal

Review the complete interface and prepare the frontend for backend integration.

### Tasks

#### Responsive Testing

- Test customer flow at:
  - desktop width
  - tablet width
  - mobile width

- Review:
  - card width
  - text wrapping
  - image sizes
  - button sizes
  - page padding
  - option controls
  - cart layout

- Fix obvious responsive issues

#### Admin UI Cleanup

- Apply basic consistent styles to:
  - Admin Home
  - Category Management
  - Menu Management
  - Option Management

- Keep admin UI practical rather than heavily designed
- Reuse shared colors / buttons / spacing where possible

#### Full Flow Review

Test:

QR Entry
→ Menu List
→ Menu Detail
→ Option Selection
→ Add to Cart
→ Cart
→ Checkout
→ Order Confirmation

Review:

- visual consistency
- interaction states
- empty states
- validation states
- sold-out state
- responsive layout

### Expected Output

- Customer ordering flow visually polished
- Basic admin UI visually consistent
- Responsive layout verified
- Frontend ready for backend integration

---

## Week 4 — Definition of Done

- Shared design system established
- Customer QR entry screen polished
- Menu list visually production-ready
- Menu detail and option selection polished
- Cart screen polished
- Checkout and confirmation screens polished
- Error and empty states styled consistently
- Responsive behavior reviewed
- Basic admin UI cleanup completed
- Existing ordering functionality remains intact
- Frontend ready for backend API integration

---

## Week 4 — Development Rule

UI changes should not modify the existing ordering logic unless a usability issue requires it.

Existing functionality to preserve:

- QR/table validation
- OrderSessionContext
- Menu visibility and sorting
- Option validation
- Quantity and subtotal calculations
- Cart merge/separate logic
- Checkout flow
- Order confirmation flow
