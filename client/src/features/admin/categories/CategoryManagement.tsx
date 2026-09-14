"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "@/lib/api/adminApi";
import type { Category } from "@/types/menu.types";

const RESTAURANT_ID = "restaurant-1";

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getAdminCategories(RESTAURANT_ID);

        if (cancelled) return;

        setCategories(data);
      } catch (error) {
        if (cancelled) return;

        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load categories.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddCategory = async () => {
    if (!name.trim()) return;

    try {
      setErrorMessage(null);

      const createdCategory = await createAdminCategory(RESTAURANT_ID, {
        name: name.trim(),
        description: description.trim() || null,
        sortOrder: categories.length + 1,
        isVisible: true,
      });

      setCategories((prev) => [...prev, createdCategory]);

      setName("");
      setDescription("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create category.",
      );
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description ?? "");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;

    try {
      setErrorMessage(null);

      const updatedCategory = await updateAdminCategory(RESTAURANT_ID, id, {
        name: editName.trim(),
        description: editDescription.trim() || null,
      });

      setCategories((prev) =>
        prev.map((category) =>
          category.id === id ? updatedCategory : category,
        ),
      );

      setEditingId(null);
      setEditName("");
      setEditDescription("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update category.",
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleDeleteCategory = async (id: string) => {
    const confirmed = window.confirm(
      "Deleting this category will permanently delete all menu items in this category. Past order records will remain.",
    );

    if (!confirmed) return;

    try {
      setErrorMessage(null);

      await deleteAdminCategory(RESTAURANT_ID, id);

      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete category.",
      );
    }
  };

  const handleToggleVisibility = async (category: Category) => {
    try {
      setErrorMessage(null);

      const updatedCategory = await updateAdminCategory(
        RESTAURANT_ID,
        category.id,
        {
          isVisible: !category.isVisible,
        },
      );

      setCategories((prev) =>
        prev.map((item) => (item.id === category.id ? updatedCategory : item)),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update visibility.",
      );
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1>Category Management</h1>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Category Management</h1>

      {errorMessage && <p>{errorMessage}</p>}

      <div>
        <h2>Add Category</h2>

        <Input
          id="category-name"
          label="Category name"
          type="text"
          placeholder="Enter category name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <Input
          id="category-description"
          label="Description"
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <Button onClick={handleAddCategory}>Add Category</Button>
      </div>

      <hr />

      {categories.map((category) => (
        <div key={category.id}>
          {editingId === category.id ? (
            <>
              <Input
                id={`edit-category-name-${category.id}`}
                label="Category name"
                type="text"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />

              <Input
                id={`edit-category-description-${category.id}`}
                label="Description"
                type="text"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
              />

              <Button onClick={() => handleSaveEdit(category.id)}>Save</Button>

              <Button variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <p>Sort Order: {category.sortOrder}</p>
              <p>Visible: {category.isVisible ? "Yes" : "No"}</p>

              <Button
                variant="secondary"
                onClick={() => handleStartEdit(category)}
              >
                Edit
              </Button>

              <Button
                variant="destructive"
                onClick={() => handleDeleteCategory(category.id)}
              >
                Delete
              </Button>

              <Button
                variant="secondary"
                onClick={() => handleToggleVisibility(category)}
              >
                {category.isVisible ? "Hide" : "Show"}
              </Button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryManagement;
