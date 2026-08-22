"use client";

import { useState } from "react";

import {
  mockMenuItems,
  mockOptionGroups,
  mockOptionItems,
} from "@/data/mockMenuData";

import { useOrderSession } from "@/features/customer/context/OrderSessionContext";

type MenuDetailProps = {
  menuItemId: string;
};

const MenuDetail = ({ menuItemId }: MenuDetailProps) => {
  const { session } = useOrderSession();

  // -----------------------------
  // Selected Option state
  // -----------------------------
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});

  // -----------------------------
  // Option validation errors
  // -----------------------------
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // -----------------------------
  // Quantity state
  // -----------------------------
  const [quantity, setQuantity] = useState(1);

  // -----------------------------
  // Single option selection
  // -----------------------------
  const handleSingleSelect = (groupId: string, itemId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupId]: [itemId],
    }));

    setValidationErrors((prev) => {
      const nextErrors = { ...prev };

      delete nextErrors[groupId];

      return nextErrors;
    });
  };

  // -----------------------------
  // Multiple option selection
  // -----------------------------
  const handleMultipleSelect = (
    groupId: string,
    itemId: string,
    maxSelection: number,
  ) => {
    setSelectedOptions((prev) => {
      const currentSelections = prev[groupId] ?? [];

      const isSelected = currentSelections.includes(itemId);

      // Remove selected item
      if (isSelected) {
        return {
          ...prev,
          [groupId]: currentSelections.filter((id) => id !== itemId),
        };
      }

      // Prevent exceeding max selection
      if (currentSelections.length >= maxSelection) {
        return prev;
      }

      // Add selected item
      return {
        ...prev,
        [groupId]: [...currentSelections, itemId],
      };
    });

    setValidationErrors((prev) => {
      const nextErrors = { ...prev };

      delete nextErrors[groupId];

      return nextErrors;
    });
  };

  // -----------------------------
  // Quantity controls
  // -----------------------------
  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // -----------------------------
  // Prevent direct access without QR session
  // -----------------------------
  if (!session) {
    return (
      <div>
        <h1>No Order Session</h1>

        <p>Please scan the table QR code first.</p>
      </div>
    );
  }

  // -----------------------------
  // Find selected Menu Item
  // -----------------------------
  const menuItem = mockMenuItems.find(
    (item) =>
      item.id === menuItemId && item.restaurantId === session.restaurant.id,
  );

  // -----------------------------
  // Invalid Menu ID
  // -----------------------------
  if (!menuItem) {
    return (
      <div>
        <h1>Menu Item Not Found</h1>

        <p>This menu item does not exist.</p>
      </div>
    );
  }

  // -----------------------------
  // Prevent sold-out item access
  // -----------------------------
  if (menuItem.isSoldOut) {
    return (
      <div>
        <h1>{menuItem.name}</h1>

        <p>This item is currently sold out.</p>
      </div>
    );
  }

  // -----------------------------
  // Find Option Groups attached
  // to this Menu Item
  // -----------------------------
  const assignedOptionGroups = mockOptionGroups
    .filter((group) => group.menuItemIds.includes(menuItem.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // -----------------------------
  // Validate selected Options
  // -----------------------------
  const validateOptions = () => {
    const errors: Record<string, string> = {};

    assignedOptionGroups.forEach((group) => {
      const selectedCount = selectedOptions[group.id]?.length ?? 0;

      if (selectedCount < group.minSelection) {
        errors[group.id] =
          `Please select at least ${group.minSelection} option(s).`;

        return;
      }

      if (selectedCount > group.maxSelection) {
        errors[group.id] =
          `You can select up to ${group.maxSelection} option(s).`;
      }
    });

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // -----------------------------
  // Get all selected Option Items
  // -----------------------------
  const selectedOptionItems = mockOptionItems.filter((item) =>
    Object.values(selectedOptions).some((selectedIds) =>
      selectedIds.includes(item.id),
    ),
  );

  // -----------------------------
  // Calculate total additional
  // price from selected Options
  // -----------------------------
  const optionsTotal = selectedOptionItems.reduce(
    (total, item) => total + item.additionalPrice,
    0,
  );

  // -----------------------------
  // Calculate item subtotal
  // (menu price + options) × quantity
  // -----------------------------
  const itemSubtotal = (menuItem.price + optionsTotal) * quantity;

  return (
    <main>
      {/* -----------------------------
          Menu information
      ------------------------------ */}
      <section>
        <div
          style={{
            width: "180px",
            height: "120px",
            border: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {menuItem.imageUrl ? (
            <img
              src={menuItem.imageUrl}
              alt={menuItem.name}
              width={180}
              height={120}
            />
          ) : (
            <span>No Image</span>
          )}
        </div>

        <h1>{menuItem.name}</h1>

        {menuItem.description && <p>{menuItem.description}</p>}

        <p>${(menuItem.price / 100).toFixed(2)}</p>
      </section>

      <hr />

      {/* -----------------------------
          Option Groups
      ------------------------------ */}
      <section>
        <h2>Options</h2>

        {assignedOptionGroups.length > 0 ? (
          assignedOptionGroups.map((group) => {
            const groupItems = mockOptionItems
              .filter((item) => item.optionGroupId === group.id)
              .sort((a, b) => a.sortOrder - b.sortOrder);

            return (
              <div key={group.id}>
                <h3>
                  {group.name}
                  {group.isRequired ? " *" : ""}
                </h3>

                <p>
                  {group.selectionType === "single"
                    ? "Select one"
                    : `Select up to ${group.maxSelection}`}
                </p>

                {groupItems.length > 0 ? (
                  groupItems.map((item) => {
                    const isSelected =
                      selectedOptions[group.id]?.includes(item.id) ?? false;

                    // Single selection
                    if (group.selectionType === "single") {
                      return (
                        <div key={item.id}>
                          <label>
                            <input
                              type="radio"
                              name={group.id}
                              checked={isSelected}
                              onChange={() =>
                                handleSingleSelect(group.id, item.id)
                              }
                            />

                            <span>{item.name}</span>

                            {item.additionalPrice > 0 && (
                              <span>
                                {" "}
                                +$
                                {(item.additionalPrice / 100).toFixed(2)}
                              </span>
                            )}
                          </label>
                        </div>
                      );
                    }

                    // Multiple selection
                    return (
                      <div key={item.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              handleMultipleSelect(
                                group.id,
                                item.id,
                                group.maxSelection,
                              )
                            }
                          />

                          <span>{item.name}</span>

                          {item.additionalPrice > 0 && (
                            <span>
                              {" "}
                              +$
                              {(item.additionalPrice / 100).toFixed(2)}
                            </span>
                          )}
                        </label>
                      </div>
                    );
                  })
                ) : (
                  <p>No options available.</p>
                )}

                {/* Validation error */}
                {validationErrors[group.id] && (
                  <p>{validationErrors[group.id]}</p>
                )}
              </div>
            );
          })
        ) : (
          <p>No options available for this item.</p>
        )}
      </section>

      <hr />

      {/* -----------------------------
          Quantity
      ------------------------------ */}
      <section>
        <h2>Quantity</h2>

        <button onClick={handleDecreaseQuantity}>-</button>

        <span
          style={{
            margin: "0 12px",
          }}
        >
          {quantity}
        </span>

        <button onClick={handleIncreaseQuantity}>+</button>
      </section>

      <hr />

      {/* -----------------------------
          Subtotal
      ------------------------------ */}
      <section>
        <h2>Subtotal: ${(itemSubtotal / 100).toFixed(2)}</h2>
      </section>

      {/* -----------------------------
          Temporary validation button
      ------------------------------ */}
      <button
        onClick={() => {
          const isValid = validateOptions();

          if (isValid) {
            console.log("Option validation passed");
          }
        }}
      >
        Validate Options
      </button>
    </main>
  );
};

export default MenuDetail;
