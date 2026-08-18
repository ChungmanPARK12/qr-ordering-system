"use client";

import { useState } from "react";
import { mockCategories, mockMenuItems } from "@/data/mockMenuData";
import type { MenuItem } from "@/types/menu.types";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);

  // Add Menu state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(mockCategories[0]?.id ?? "");

  // Edit Menu state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");

  const handleAddMenu = () => {
    if (!name.trim()) return;
    if (!categoryId) return;

    const priceInCents = Math.round(Number(price) * 100);

    if (Number.isNaN(priceInCents) || priceInCents < 0) return;

    const categoryMenuCount = menuItems.filter(
      (item) => item.categoryId === categoryId,
    ).length;

    const newMenuItem: MenuItem = {
      id: `menu-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      price: priceInCents,
      imageUrl: undefined,
      sortOrder: categoryMenuCount + 1,
      isVisible: true,
      isSoldOut: false,
      restaurantId: "restaurant-1",
      categoryId,
    };

    setMenuItems((prev) => [...prev, newMenuItem]);

    setName("");
    setDescription("");
    setPrice("");
    setCategoryId(mockCategories[0]?.id ?? "");
  };

  const handleStartEdit = (menuItem: MenuItem) => {
    setEditingId(menuItem.id);
    setEditName(menuItem.name);
    setEditDescription(menuItem.description ?? "");
    setEditPrice((menuItem.price / 100).toFixed(2));
    setEditCategoryId(menuItem.categoryId);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    if (!editCategoryId) return;

    const priceInCents = Math.round(Number(editPrice) * 100);

    if (Number.isNaN(priceInCents) || priceInCents < 0) return;

    setMenuItems((prev) =>
      prev.map((menuItem) =>
        menuItem.id === id
          ? {
              ...menuItem,
              name: editName.trim(),
              description: editDescription.trim() || undefined,
              price: priceInCents,
              categoryId: editCategoryId,
            }
          : menuItem,
      ),
    );

    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditPrice("");
    setEditCategoryId("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditPrice("");
    setEditCategoryId("");
  };

  const handleDeleteMenu = (id: string) => {
    setMenuItems((prev) => prev.filter((menuItem) => menuItem.id !== id));
  };

  const handleToggleVisibility = (id: string) => {
    setMenuItems((prev) =>
      prev.map((menuItem) =>
        menuItem.id === id
          ? { ...menuItem, isVisible: !menuItem.isVisible }
          : menuItem,
      ),
    );
  };

  const handleToggleSoldOut = (id: string) => {
    setMenuItems((prev) =>
      prev.map((menuItem) =>
        menuItem.id === id
          ? { ...menuItem, isSoldOut: !menuItem.isSoldOut }
          : menuItem,
      ),
    );
  };

  return (
    <div>
      <h1>Menu Management</h1>

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

        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          {mockCategories.map((category) => (
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

              <select
                value={editCategoryId}
                onChange={(event) => setEditCategoryId(event.target.value)}
              >
                {mockCategories.map((category) => (
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
              <button onClick={() => handleToggleVisibility(menuItem.id)}>
                {menuItem.isVisible ? "Hide" : "Show"}
              </button>

              <button onClick={() => handleToggleSoldOut(menuItem.id)}>
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
