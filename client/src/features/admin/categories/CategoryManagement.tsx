"use client";

import { useState } from "react";
import { mockCategories } from "@/data/mockMenuData";
import type { Category } from "@/types/menu.types";

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleAddCategory = () => {
    if (!name.trim()) return;

    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      sortOrder: categories.length + 1,
      isVisible: true,
      restaurantId: "restaurant-1",
    };

    setCategories((prev) => [...prev, newCategory]);

    setName("");
    setDescription("");
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description ?? "");
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;

    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? {
              ...category,
              name: editName.trim(),
              description: editDescription.trim() || undefined,
            }
          : category,
      ),
    );

    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const handleToggleVisibility = (id: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? { ...category, isVisible: !category.isVisible }
          : category,
      ),
    );
  };

  return (
    <div>
      <h1>Category Management</h1>

      <div>
        <h2>Add Category</h2>

        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      <hr />

      {categories.map((category) => (
        <div key={category.id}>
          {editingId === category.id ? (
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

              <button onClick={() => handleSaveEdit(category.id)}>Save</button>

              <button onClick={handleCancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <p>Sort Order: {category.sortOrder}</p>
              <p>Visible: {category.isVisible ? "Yes" : "No"}</p>

              <button onClick={() => handleStartEdit(category)}>Edit</button>
              <button onClick={() => handleDeleteCategory(category.id)}>
                Delete
              </button>
              <button onClick={() => handleToggleVisibility(category.id)}>
                {category.isVisible ? "Hide" : "Show"}
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryManagement;
