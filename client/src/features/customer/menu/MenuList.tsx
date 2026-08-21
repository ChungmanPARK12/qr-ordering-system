"use client";

import { mockCategories, mockMenuItems } from "@/data/mockMenuData";
import { useOrderSession } from "@/features/customer/context/OrderSessionContext";

import styles from "./MenuList.module.css";

const MenuList = () => {
  const { session } = useOrderSession();

  // Prevent direct access without QR session.
  if (!session) {
    return (
      <div className={styles.page}>
        <h1>No Order Session</h1>
        <p>Please scan the table QR code first.</p>
      </div>
    );
  }

  // Show only visible categories belonging to the current restaurant.
  const visibleCategories = mockCategories
    .filter(
      (category) =>
        category.restaurantId === session.restaurant.id && category.isVisible,
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.restaurantName}>{session.restaurant.name}</h1>

        <p className={styles.tableName}>{session.table.name}</p>
      </header>

      <h2 className={styles.menuTitle}>Menu</h2>

      {visibleCategories.map((category) => {
        // Find visible menu items belonging to the current category.
        const categoryMenuItems = mockMenuItems
          .filter(
            (menuItem) =>
              menuItem.restaurantId === session.restaurant.id &&
              menuItem.categoryId === category.id &&
              menuItem.isVisible,
          )
          .sort((a, b) => a.sortOrder - b.sortOrder);

        return (
          <section key={category.id} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{category.name}</h2>

            {category.description && (
              <p className={styles.categoryDescription}>
                {category.description}
              </p>
            )}

            {categoryMenuItems.length > 0 ? (
              <div className={styles.menuList}>
                {categoryMenuItems.map((menuItem) => (
                  <div
                    key={menuItem.id}
                    className={`${styles.menuCard} ${
                      menuItem.isSoldOut ? styles.soldOut : ""
                    }`}
                  >
                    <div className={styles.imagePlaceholder}>
                      {menuItem.imageUrl ? (
                        <img
                          src={menuItem.imageUrl}
                          alt={menuItem.name}
                          className={styles.menuImage}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>

                    <div className={styles.menuInfo}>
                      <h3 className={styles.menuName}>{menuItem.name}</h3>

                      {menuItem.description && (
                        <p className={styles.menuDescription}>
                          {menuItem.description}
                        </p>
                      )}

                      <p className={styles.price}>
                        ${(menuItem.price / 100).toFixed(2)}
                      </p>

                      {menuItem.isSoldOut && (
                        <span className={styles.soldOutLabel}>Sold Out</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>No menu items available.</p>
            )}
          </section>
        );
      })}
    </main>
  );
};

export default MenuList;
