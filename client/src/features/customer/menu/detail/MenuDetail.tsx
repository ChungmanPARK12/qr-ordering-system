"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button/Button";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import QuantityControl from "@/components/ui/QuantityControl/QuantityControl";
import Radio from "@/components/ui/Radio/Radio";

import { getCustomerMenuItem } from "@/lib/api/customerApi";

import { useOrderSession } from "@/features/customer/context/OrderSessionContext";
import { useCart } from "@/features/customer/context/CartContext";

import type { MenuDetailProps, MenuItemDetail } from "@/types/menu.types";

import { buildCartOptions, validateOptionSelections } from "./menuOption.utils";

import styles from "./MenuDetail.module.css";

const MenuDetail = ({ menuItemId }: MenuDetailProps) => {
  const router = useRouter();

  const { session } = useOrderSession();
  const { addItem } = useCart();

  const [menuItem, setMenuItem] = useState<MenuItemDetail | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [quantity, setQuantity] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // -----------------------------
  // Load menu item from backend
  // -----------------------------
  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadMenuItem = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getCustomerMenuItem(
          session.restaurant.id,
          menuItemId,
        );

        if (cancelled) {
          return;
        }

        setMenuItem(data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Failed to load menu item.";

        setErrorMessage(message);
        setMenuItem(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadMenuItem();

    return () => {
      cancelled = true;
    };
  }, [session, menuItemId]);

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
  // Loading
  // -----------------------------
  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
        <p>Please wait while we load this menu item.</p>
      </div>
    );
  }

  // -----------------------------
  // API error
  // -----------------------------
  if (errorMessage) {
    return (
      <div>
        <h1>Menu Item Error</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }

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

  const assignedOptionGroups = menuItem.optionGroups;

  // -----------------------------
  // Validate selected options
  // Validation logic is handled in menuOption.utils
  // -----------------------------
  const validateOptions = () => {
    const errors = validateOptionSelections(
      assignedOptionGroups,
      selectedOptions,
    );

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // -----------------------------
  // Selected option items
  // -----------------------------
  const selectedOptionItems = assignedOptionGroups.flatMap((group) =>
    group.optionItems.filter((item) =>
      selectedOptions[group.id]?.includes(item.id),
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
  // Add to cart
  // Add to cart logic is handled in menuOption.utils
  // -----------------------------
  const handleAddToCart = () => {
    const isValid = validateOptions();

    if (!isValid) {
      return;
    }

    const cartOptions = buildCartOptions(assignedOptionGroups, selectedOptions);

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
              const groupItems = group.optionItems;
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
                        {group.selectionType === "SINGLE"
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
                                +$
                                {(item.additionalPrice / 100).toFixed(2)}
                              </span>
                            )}
                          </div>
                        );

                        if (group.selectionType === "SINGLE") {
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
