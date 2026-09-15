"use client";

import { useEffect, useState } from "react";

import {
  createAdminMenuItem,
  deleteAdminMenuItem,
  getAdminCategories,
  getAdminMenuItems,
  updateAdminMenuItem,
} from "@/lib/api/adminApi";
import type { Category, MenuItem } from "@/types/menu.types";

const RESTAURANT_ID = "restaurant-1";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Add Menu state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Edit Menu state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [menuData, categoryData] = await Promise.all([
          getAdminMenuItems(RESTAURANT_ID),
          getAdminCategories(RESTAURANT_ID),
        ]);

        if (cancelled) return;

        setMenuItems(menuData);
        setCategories(categoryData);

        if (categoryData.length > 0) {
          setCategoryId(categoryData[0].id);
        }
      } catch (error) {
        if (cancelled) return;

        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load menu data.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddMenu = async () => {
    if (!name.trim() || !categoryId) return;

    const priceInCents = Math.round(Number(price) * 100);

    if (Number.isNaN(priceInCents) || priceInCents < 0) return;

    try {
      setErrorMessage(null);

      const createdMenuItem = await createAdminMenuItem(RESTAURANT_ID, {
        name: name.trim(),
        description: description.trim() || null,
        price: priceInCents,
        imageUrl: imageUrl.trim() || null,
        isVisible: true,
        isSoldOut: false,
        categoryId,
      });

      setMenuItems((prev) => [...prev, createdMenuItem]);

      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create menu item.",
      );
    }
  };

  const handleStartEdit = (menuItem: MenuItem) => {
    setEditingId(menuItem.id);
    setEditName(menuItem.name);
    setEditDescription(menuItem.description ?? "");
    setEditPrice((menuItem.price / 100).toFixed(2));
    setEditImageUrl(menuItem.imageUrl ?? "");
    setEditCategoryId(menuItem.categoryId);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim() || !editCategoryId) return;

    const priceInCents = Math.round(Number(editPrice) * 100);

    if (Number.isNaN(priceInCents) || priceInCents < 0) return;

    try {
      setErrorMessage(null);

      const updatedMenuItem = await updateAdminMenuItem(RESTAURANT_ID, id, {
        name: editName.trim(),
        description: editDescription.trim() || null,
        price: priceInCents,
        imageUrl: editImageUrl.trim() || null,
        categoryId: editCategoryId,
      });

      setMenuItems((prev) =>
        prev.map((menuItem) =>
          menuItem.id === id ? updatedMenuItem : menuItem,
        ),
      );

      setEditingId(null);
      setEditName("");
      setEditDescription("");
      setEditPrice("");
      setEditImageUrl("");
      setEditCategoryId("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update menu item.",
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditPrice("");
    setEditImageUrl("");
    setEditCategoryId("");
  };

  const handleDeleteMenu = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this menu item? Past order records will remain.",
    );

    if (!confirmed) return;

    try {
      setErrorMessage(null);

      await deleteAdminMenuItem(RESTAURANT_ID, id);

      setMenuItems((prev) => prev.filter((menuItem) => menuItem.id !== id));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete menu item.",
      );
    }
  };

  const handleToggleVisibility = async (menuItem: MenuItem) => {
    try {
      setErrorMessage(null);

      const updatedMenuItem = await updateAdminMenuItem(
        RESTAURANT_ID,
        menuItem.id,
        {
          isVisible: !menuItem.isVisible,
        },
      );

      setMenuItems((prev) =>
        prev.map((item) => (item.id === menuItem.id ? updatedMenuItem : item)),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update visibility.",
      );
    }
  };

  const handleToggleSoldOut = async (menuItem: MenuItem) => {
    try {
      setErrorMessage(null);

      const updatedMenuItem = await updateAdminMenuItem(
        RESTAURANT_ID,
        menuItem.id,
        {
          isSoldOut: !menuItem.isSoldOut,
        },
      );

      setMenuItems((prev) =>
        prev.map((item) => (item.id === menuItem.id ? updatedMenuItem : item)),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update sold-out status.",
      );
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1>Menu Management</h1>
        <p>Loading menu items...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Menu Management</h1>

      {errorMessage && <p>{errorMessage}</p>}

      <div>
        <h2>Add Menu</h2>

        <input
          type="text"
          placeholder="Menu name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />

        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
        />

        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button onClick={handleAddMenu}>Add Menu</button>
      </div>

      <hr />

      {menuItems.map((menuItem) => (
        <div key={menuItem.id}>
          {editingId === menuItem.id ? (
            <>
              <input
                type="text"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />

              <input
                type="text"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
              />

              <input
                type="number"
                step="0.01"
                min="0"
                value={editPrice}
                onChange={(event) => setEditPrice(event.target.value)}
              />

              <input
                type="text"
                placeholder="Image URL"
                value={editImageUrl}
                onChange={(event) => setEditImageUrl(event.target.value)}
              />

              <select
                value={editCategoryId}
                onChange={(event) => setEditCategoryId(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button onClick={() => handleSaveEdit(menuItem.id)}>Save</button>

              <button onClick={handleCancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <div>
                {menuItem.imageUrl ? (
                  <img
                    src={menuItem.imageUrl}
                    alt={menuItem.name}
                    width={120}
                    height={80}
                  />
                ) : (
                  <div
                    style={{
                      width: "120px",
                      height: "80px",
                      border: "1px solid #ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>

              <h2>{menuItem.name}</h2>
              <p>{menuItem.description}</p>
              <p>Price: ${(menuItem.price / 100).toFixed(2)}</p>
              <p>Category ID: {menuItem.categoryId}</p>
              <p>Sort Order: {menuItem.sortOrder}</p>
              <p>Visible: {menuItem.isVisible ? "Yes" : "No"}</p>
              <p>Sold Out: {menuItem.isSoldOut ? "Yes" : "No"}</p>

              <button onClick={() => handleStartEdit(menuItem)}>Edit</button>

              <button onClick={() => handleDeleteMenu(menuItem.id)}>
                Delete
              </button>

              <button onClick={() => handleToggleVisibility(menuItem)}>
                {menuItem.isVisible ? "Hide" : "Show"}
              </button>

              <button onClick={() => handleToggleSoldOut(menuItem)}>
                {menuItem.isSoldOut ? "Mark Available" : "Mark Sold Out"}
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuManagement;
