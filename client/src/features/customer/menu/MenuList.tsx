"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card/Card";
import { getCustomerMenu } from "@/lib/api/customerApi";
import { useOrderSession } from "@/features/customer/context/OrderSessionContext";

import styles from "./MenuList.module.css";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  sortOrder: number;
  isVisible: boolean;
  isSoldOut: boolean;
  restaurantId: string;
  categoryId: string;
};

type MenuCategory = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isVisible: boolean;
  restaurantId: string;
  menuItems: MenuItem[];
};

const MenuList = () => {
  const router = useRouter();

  const { session } = useOrderSession();

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // -----------------------------
  // Load menu from backend
  // -----------------------------
  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadMenu = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getCustomerMenu(session.restaurant.id);

        if (cancelled) {
          return;
        }

        setCategories(data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Failed to load menu.";

        setErrorMessage(message);
        setCategories([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadMenu();

    return () => {
      cancelled = true;
    };
  }, [session]);

  // -----------------------------
  // Prevent direct access
  // -----------------------------
  if (!session) {
    return (
      <div className={styles.page}>
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
      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.restaurantName}>{session.restaurant.name}</h1>

          <p className={styles.tableName}>{session.table.name}</p>
        </header>

        <h2 className={styles.menuTitle}>Menu</h2>

        <p className={styles.emptyMessage}>Loading menu...</p>
      </main>
    );
  }

  // -----------------------------
  // API error
  // -----------------------------
  if (errorMessage) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.restaurantName}>{session.restaurant.name}</h1>

          <p className={styles.tableName}>{session.table.name}</p>
        </header>

        <h2 className={styles.menuTitle}>Menu</h2>

        <p className={styles.emptyMessage}>{errorMessage}</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      {/* Restaurant / table information */}
      <header className={styles.header}>
        <h1 className={styles.restaurantName}>{session.restaurant.name}</h1>

        <p className={styles.tableName}>{session.table.name}</p>
      </header>

      <h2 className={styles.menuTitle}>Menu</h2>

      {/* No visible categories */}
      {categories.length === 0 ? (
        <p className={styles.emptyMessage}>
          No menu categories are currently available.
        </p>
      ) : (
        categories.map((category) => (
          <section key={category.id} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{category.name}</h2>

            {category.description && (
              <p className={styles.categoryDescription}>
                {category.description}
              </p>
            )}

            {category.menuItems.length > 0 ? (
              <div className={styles.menuList}>
                {category.menuItems.map((menuItem) => (
                  <Card
                    key={menuItem.id}
                    className={`${styles.menuCard} ${
                      menuItem.isSoldOut ? styles.soldOut : ""
                    }`}
                    onClick={() => {
                      if (menuItem.isSoldOut) {
                        return;
                      }

                      router.push(`/order/menu/${menuItem.id}`);
                    }}
                  >
                    {/* Menu image / placeholder */}
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

                    {/* Menu information */}
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
                  </Card>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>No menu items available.</p>
            )}
          </section>
        ))
      )}
    </main>
  );
};

export default MenuList;
