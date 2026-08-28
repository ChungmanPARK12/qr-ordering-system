"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button/Button";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import QuantityControl from "@/components/ui/QuantityControl/QuantityControl";
import Radio from "@/components/ui/Radio/Radio";

import {
  mockMenuItems,
  mockOptionGroups,
  mockOptionItems,
} from "@/data/mockMenuData";

import { useOrderSession } from "@/features/customer/context/OrderSessionContext";
import { useCart } from "@/features/customer/context/CartContext";

import type { CartOptionItem } from "@/types/cart.types";

import styles from "./MenuDetail.module.css";

type MenuDetailProps = {
  menuItemId: string;
};

const MenuDetail = ({ menuItemId }: MenuDetailProps) => {
  const router = useRouter();

  const { session } = useOrderSession();
  const { addItem } = useCart();

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

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

      if (isSelected) {
        return {
          ...prev,
          [groupId]: currentSelections.filter((id) => id !== itemId),
        };
      }

      if (currentSelections.length >= maxSelection) {
        return prev;
      }

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
  // Find selected menu item
  // -----------------------------
  const menuItem = mockMenuItems.find(
    (item) =>
      item.id === menuItemId && item.restaurantId === session.restaurant.id,
  );

  // -----------------------------
  // Invalid menu ID
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
  // Find option groups
  // -----------------------------
  const assignedOptionGroups = mockOptionGroups
    .filter((group) => group.menuItemIds.includes(menuItem.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // -----------------------------
  // Validate selected options
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
  // Selected option items
  // -----------------------------
  const selectedOptionItems = mockOptionItems.filter((item) =>
    Object.values(selectedOptions).some((selectedIds) =>
      selectedIds.includes(item.id),
    ),
  );

  // -----------------------------
  // Additional option price
  // -----------------------------
  const optionsTotal = selectedOptionItems.reduce(
    (total, item) => total + item.additionalPrice,
    0,
  );

  // -----------------------------
  // Subtotal
  // -----------------------------
  const itemSubtotal = (menuItem.price + optionsTotal) * quantity;

  // -----------------------------
  // Add configured item to cart
  // -----------------------------
  const handleAddToCart = () => {
    const isValid = validateOptions();

    if (!isValid) {
      return;
    }

    const cartOptions: CartOptionItem[] = [];

    assignedOptionGroups.forEach((group) => {
      const selectedIds = selectedOptions[group.id] ?? [];

      selectedIds.forEach((optionItemId) => {
        const optionItem = mockOptionItems.find(
          (item) => item.id === optionItemId,
        );

        if (!optionItem) {
          return;
        }

        cartOptions.push({
          optionGroupId: group.id,
          optionGroupName: group.name,
          optionItemId: optionItem.id,
          optionItemName: optionItem.name,
          additionalPrice: optionItem.additionalPrice,
        });
      });
    });

    addItem({
      menuItemId: menuItem.id,
      menuItemName: menuItem.name,
      basePrice: menuItem.price,
      selectedOptions: cartOptions,
      quantity,
    });

    router.push("/order/cart");
  };

  return (
    <main className={styles.page}>
      {/* -----------------------------
          Menu information
      ------------------------------ */}
      <section className={styles.menuInfoSection}>
        <div className={styles.imageWrapper}>
          {menuItem.imageUrl ? (
            <img
              src={menuItem.imageUrl}
              alt={menuItem.name}
              className={styles.menuImage}
            />
          ) : (
            <span className={styles.imagePlaceholder}>No Image</span>
          )}
        </div>

        <div className={styles.menuInfo}>
          <h1 className={styles.menuName}>{menuItem.name}</h1>

          {menuItem.description && (
            <p className={styles.menuDescription}>{menuItem.description}</p>
          )}

          <p className={styles.basePrice}>
            ${(menuItem.price / 100).toFixed(2)}
          </p>
        </div>
      </section>

      {/* -----------------------------
          Option Groups
      ------------------------------ */}
      <section className={styles.optionsSection}>
        <h2 className={styles.sectionTitle}>Options</h2>

        {assignedOptionGroups.length > 0 ? (
          <div className={styles.optionGroupList}>
            {assignedOptionGroups.map((group) => {
              const groupItems = mockOptionItems
                .filter((item) => item.optionGroupId === group.id)
                .sort((a, b) => a.sortOrder - b.sortOrder);

              const hasError = Boolean(validationErrors[group.id]);

              return (
                <div
                  key={group.id}
                  className={`${styles.optionGroup} ${
                    hasError ? styles.optionGroupError : ""
                  }`}
                >
                  <div className={styles.optionGroupHeader}>
                    <div>
                      <h3 className={styles.optionGroupTitle}>{group.name}</h3>

                      <p className={styles.optionHint}>
                        {group.selectionType === "single"
                          ? "Select one"
                          : group.minSelection > 0
                            ? `Select ${group.minSelection} to ${group.maxSelection}`
                            : `Select up to ${group.maxSelection}`}
                      </p>
                    </div>

                    <span
                      className={`${styles.requirementBadge} ${
                        group.isRequired
                          ? styles.requiredBadge
                          : styles.optionalBadge
                      }`}
                    >
                      {group.isRequired ? "Required" : "Optional"}
                    </span>
                  </div>

                  {groupItems.length > 0 ? (
                    <div className={styles.optionList}>
                      {groupItems.map((item) => {
                        const isSelected =
                          selectedOptions[group.id]?.includes(item.id) ?? false;

                        const optionLabel = (
                          <div className={styles.optionLabel}>
                            <span>{item.name}</span>

                            {item.additionalPrice > 0 && (
                              <span className={styles.optionPrice}>
                                +${(item.additionalPrice / 100).toFixed(2)}
                              </span>
                            )}
                          </div>
                        );

                        if (group.selectionType === "single") {
                          return (
                            <div
                              key={item.id}
                              className={`${styles.optionRow} ${
                                isSelected ? styles.selectedOption : ""
                              }`}
                            >
                              <Radio
                                id={`radio-${group.id}-${item.id}`}
                                name={group.id}
                                checked={isSelected}
                                onChange={() =>
                                  handleSingleSelect(group.id, item.id)
                                }
                                label={optionLabel}
                              />
                            </div>
                          );
                        }

                        return (
                          <div
                            key={item.id}
                            className={`${styles.optionRow} ${
                              isSelected ? styles.selectedOption : ""
                            }`}
                          >
                            <Checkbox
                              id={`checkbox-${group.id}-${item.id}`}
                              checked={isSelected}
                              onChange={() =>
                                handleMultipleSelect(
                                  group.id,
                                  item.id,
                                  group.maxSelection,
                                )
                              }
                              label={optionLabel}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className={styles.emptyMessage}>No options available.</p>
                  )}

                  {validationErrors[group.id] && (
                    <p className={styles.validationError}>
                      {validationErrors[group.id]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className={styles.emptyMessage}>
            No options available for this item.
          </p>
        )}
      </section>

      {/* -----------------------------
          Quantity
      ------------------------------ */}
      <section className={styles.quantitySection}>
        <h2 className={styles.sectionTitle}>Quantity</h2>

        <QuantityControl
          value={quantity}
          min={1}
          max={99}
          onChange={setQuantity}
        />
      </section>

      {/* -----------------------------
          Subtotal
      ------------------------------ */}
      <section className={styles.subtotalSection}>
        <span className={styles.subtotalLabel}>Subtotal</span>
        <span className={styles.subtotalPrice}>
          ${(itemSubtotal / 100).toFixed(2)}
        </span>
      </section>

      {/* -----------------------------
          Add to Cart
      ------------------------------ */}
      <Button className={styles.addToCartButton} onClick={handleAddToCart}>
        Add to Cart — ${(itemSubtotal / 100).toFixed(2)}
      </Button>
    </main>
  );
};

export default MenuDetail;
