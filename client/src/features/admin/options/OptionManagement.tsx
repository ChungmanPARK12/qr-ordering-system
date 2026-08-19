"use client";

import { useState } from "react";
import {
  mockMenuItems,
  mockOptionGroups,
  mockOptionItems,
} from "@/data/mockMenuData";

import type {
  OptionGroup,
  OptionItem,
  OptionSelectionType,
} from "@/types/menu.types";

const OptionManagement = () => {
  // -----------------------------
  // Option Group list state
  // -----------------------------
  const [optionGroups, setOptionGroups] =
    useState<OptionGroup[]>(mockOptionGroups);

  // -----------------------------
  // Option Item list state
  // -----------------------------
  const [optionItems, setOptionItems] = useState<OptionItem[]>(mockOptionItems);

  // -----------------------------
  // Add Option Group state
  // -----------------------------
  const [name, setName] = useState("");

  const [selectionType, setSelectionType] =
    useState<OptionSelectionType>("single");

  const [isRequired, setIsRequired] = useState(false);

  const [minSelection, setMinSelection] = useState(0);

  const [maxSelection, setMaxSelection] = useState(1);

  // -----------------------------
  // Edit Option Group state
  // -----------------------------
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editName, setEditName] = useState("");

  const [editSelectionType, setEditSelectionType] =
    useState<OptionSelectionType>("single");

  const [editIsRequired, setEditIsRequired] = useState(false);

  const [editMinSelection, setEditMinSelection] = useState(0);

  const [editMaxSelection, setEditMaxSelection] = useState(1);

  // -----------------------------
  // Add Option Item state
  // -----------------------------
  const [newItemName, setNewItemName] = useState("");

  const [newItemPrice, setNewItemPrice] = useState("");

  // -----------------------------
  // Edit Option Item state
  // -----------------------------
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [editItemName, setEditItemName] = useState("");

  const [editItemPrice, setEditItemPrice] = useState("");

  // -----------------------------
  // Add Option Group
  // -----------------------------
  const handleAddOptionGroup = () => {
    if (!name.trim()) return;
    if (minSelection < 0) return;
    if (maxSelection < 1) return;
    if (minSelection > maxSelection) return;

    // Single selection group can only allow one selection
    if (selectionType === "single" && maxSelection !== 1) {
      return;
    }

    const newOptionGroup: OptionGroup = {
      id: `option-group-${Date.now()}`,
      name: name.trim(),
      selectionType,
      isRequired,
      minSelection,
      maxSelection,
      sortOrder: optionGroups.length + 1,
      restaurantId: "restaurant-1",

      // No menu is assigned when the group is first created
      menuItemIds: [],
    };

    setOptionGroups((prev) => [...prev, newOptionGroup]);

    // Reset form
    setName("");
    setSelectionType("single");
    setIsRequired(false);
    setMinSelection(0);
    setMaxSelection(1);
  };

  // -----------------------------
  // Start Option Group edit
  // -----------------------------
  const handleStartEdit = (group: OptionGroup) => {
    setEditingId(group.id);
    setEditName(group.name);
    setEditSelectionType(group.selectionType);
    setEditIsRequired(group.isRequired);
    setEditMinSelection(group.minSelection);
    setEditMaxSelection(group.maxSelection);
  };

  // -----------------------------
  // Save Option Group edit
  // -----------------------------
  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    if (editMinSelection < 0) return;
    if (editMaxSelection < 1) return;
    if (editMinSelection > editMaxSelection) return;

    if (editSelectionType === "single" && editMaxSelection !== 1) {
      return;
    }

    setOptionGroups((prev) =>
      prev.map((group) =>
        group.id === id
          ? {
              ...group,
              name: editName.trim(),
              selectionType: editSelectionType,
              isRequired: editIsRequired,
              minSelection: editMinSelection,
              maxSelection: editMaxSelection,
            }
          : group,
      ),
    );

    // Reset edit state
    setEditingId(null);
    setEditName("");
    setEditSelectionType("single");
    setEditIsRequired(false);
    setEditMinSelection(0);
    setEditMaxSelection(1);
  };

  // -----------------------------
  // Cancel Option Group edit
  // -----------------------------
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSelectionType("single");
    setEditIsRequired(false);
    setEditMinSelection(0);
    setEditMaxSelection(1);
  };

  // -----------------------------
  // Delete Option Group
  // -----------------------------
  const handleDeleteOptionGroup = (id: string) => {
    // Remove Option Group
    setOptionGroups((prev) => prev.filter((group) => group.id !== id));

    // Remove all Option Items belonging to the group
    setOptionItems((prev) => prev.filter((item) => item.optionGroupId !== id));
  };

  // -----------------------------
  // Add Option Item
  // -----------------------------
  const handleAddOptionItem = (optionGroupId: string) => {
    if (!newItemName.trim()) return;

    // Convert displayed dollar amount to cents
    const additionalPriceInCents = Math.round(Number(newItemPrice) * 100);

    if (Number.isNaN(additionalPriceInCents) || additionalPriceInCents < 0) {
      return;
    }

    // Count existing items in the selected group
    const groupItemCount = optionItems.filter(
      (item) => item.optionGroupId === optionGroupId,
    ).length;

    const newOptionItem: OptionItem = {
      id: `option-item-${Date.now()}`,
      name: newItemName.trim(),
      additionalPrice: additionalPriceInCents,
      sortOrder: groupItemCount + 1,
      optionGroupId,
    };

    setOptionItems((prev) => [...prev, newOptionItem]);

    // Reset Option Item form
    setNewItemName("");
    setNewItemPrice("");
  };

  // -----------------------------
  // Start Option Item edit
  // -----------------------------
  const handleStartItemEdit = (item: OptionItem) => {
    setEditingItemId(item.id);
    setEditItemName(item.name);

    // Convert cents back to dollar display value
    setEditItemPrice((item.additionalPrice / 100).toFixed(2));
  };

  // -----------------------------
  // Save Option Item edit
  // -----------------------------
  const handleSaveItemEdit = (id: string) => {
    if (!editItemName.trim()) return;

    const additionalPriceInCents = Math.round(Number(editItemPrice) * 100);

    if (Number.isNaN(additionalPriceInCents) || additionalPriceInCents < 0) {
      return;
    }

    setOptionItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              name: editItemName.trim(),
              additionalPrice: additionalPriceInCents,
            }
          : item,
      ),
    );

    // Reset Option Item edit state
    setEditingItemId(null);
    setEditItemName("");
    setEditItemPrice("");
  };

  // -----------------------------
  // Cancel Option Item edit
  // -----------------------------
  const handleCancelItemEdit = () => {
    setEditingItemId(null);
    setEditItemName("");
    setEditItemPrice("");
  };

  // -----------------------------
  // Delete Option Item
  // -----------------------------
  const handleDeleteOptionItem = (id: string) => {
    setOptionItems((prev) => prev.filter((item) => item.id !== id));
  };

  // -----------------------------
  // Attach / Detach Menu Item
  // -----------------------------
  const handleToggleMenuAssignment = (
    optionGroupId: string,
    menuItemId: string,
  ) => {
    setOptionGroups((prev) =>
      prev.map((group) => {
        if (group.id !== optionGroupId) {
          return group;
        }

        const isAssigned = group.menuItemIds.includes(menuItemId);

        return {
          ...group,

          // Remove the menu if already assigned,
          // otherwise add it to the group.
          menuItemIds: isAssigned
            ? group.menuItemIds.filter((id) => id !== menuItemId)
            : [...group.menuItemIds, menuItemId],
        };
      }),
    );
  };

  return (
    <div>
      <h1>Option Management</h1>

      {/* -----------------------------
          Add Option Group
      ------------------------------ */}
      <div>
        <h2>Add Option Group</h2>

        <input
          type="text"
          placeholder="Group name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <select
          value={selectionType}
          onChange={(event) => {
            const type = event.target.value as OptionSelectionType;

            setSelectionType(type);

            // Single selection always has maxSelection = 1
            if (type === "single") {
              setMaxSelection(1);

              if (minSelection > 1) {
                setMinSelection(1);
              }
            }
          }}
        >
          <option value="single">Single</option>

          <option value="multiple">Multiple</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={isRequired}
            onChange={(event) => {
              const required = event.target.checked;

              setIsRequired(required);

              // Required group must have at least one selection
              if (required && minSelection === 0) {
                setMinSelection(1);
              }

              // Optional group allows zero selection
              if (!required) {
                setMinSelection(0);
              }
            }}
          />
          Required
        </label>

        <input
          type="number"
          min="0"
          max={selectionType === "single" ? 1 : undefined}
          value={minSelection}
          onChange={(event) => setMinSelection(Number(event.target.value))}
          placeholder="Min selection"
        />

        <input
          type="number"
          min="1"
          max={selectionType === "single" ? 1 : undefined}
          value={maxSelection}
          onChange={(event) => setMaxSelection(Number(event.target.value))}
          placeholder="Max selection"
          disabled={selectionType === "single"}
        />

        <button onClick={handleAddOptionGroup}>Add Option Group</button>
      </div>

      <hr />

      {/* -----------------------------
          Option Group list
      ------------------------------ */}
      {optionGroups.map((group) => {
        // Find Option Items belonging to this group
        const groupItems = optionItems.filter(
          (item) => item.optionGroupId === group.id,
        );

        return (
          <div key={group.id}>
            {editingId === group.id ? (
              <>
                {/* -----------------------------
                    Edit Option Group
                ------------------------------ */}

                <input
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                />

                <select
                  value={editSelectionType}
                  onChange={(event) => {
                    const type = event.target.value as OptionSelectionType;

                    setEditSelectionType(type);

                    if (type === "single") {
                      setEditMaxSelection(1);

                      if (editMinSelection > 1) {
                        setEditMinSelection(1);
                      }
                    }
                  }}
                >
                  <option value="single">Single</option>

                  <option value="multiple">Multiple</option>
                </select>

                <label>
                  <input
                    type="checkbox"
                    checked={editIsRequired}
                    onChange={(event) => {
                      const required = event.target.checked;

                      setEditIsRequired(required);

                      if (required && editMinSelection === 0) {
                        setEditMinSelection(1);
                      }

                      if (!required) {
                        setEditMinSelection(0);
                      }
                    }}
                  />
                  Required
                </label>

                <input
                  type="number"
                  min="0"
                  max={editSelectionType === "single" ? 1 : undefined}
                  value={editMinSelection}
                  onChange={(event) =>
                    setEditMinSelection(Number(event.target.value))
                  }
                />

                <input
                  type="number"
                  min="1"
                  max={editSelectionType === "single" ? 1 : undefined}
                  value={editMaxSelection}
                  onChange={(event) =>
                    setEditMaxSelection(Number(event.target.value))
                  }
                  disabled={editSelectionType === "single"}
                />

                <button onClick={() => handleSaveEdit(group.id)}>Save</button>

                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {/* -----------------------------
                    Option Group information
                ------------------------------ */}

                <h2>{group.name}</h2>

                <p>Selection Type: {group.selectionType}</p>

                <p>Required: {group.isRequired ? "Yes" : "No"}</p>

                <p>Min Selection: {group.minSelection}</p>

                <p>Max Selection: {group.maxSelection}</p>

                <button onClick={() => handleStartEdit(group)}>Edit</button>

                <button onClick={() => handleDeleteOptionGroup(group.id)}>
                  Delete
                </button>

                {/* -----------------------------
                    Assigned Menu Items
                ------------------------------ */}

                <h3>Assigned Menus</h3>

                {mockMenuItems.map((menuItem) => (
                  <label
                    key={menuItem.id}
                    style={{
                      display: "block",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={group.menuItemIds.includes(menuItem.id)}
                      onChange={() =>
                        handleToggleMenuAssignment(group.id, menuItem.id)
                      }
                    />

                    {menuItem.name}
                  </label>
                ))}

                <h3>Options</h3>

                {/* -----------------------------
                    Add Option Item
                ------------------------------ */}

                <div>
                  <input
                    type="text"
                    placeholder="Option name"
                    value={newItemName}
                    onChange={(event) => setNewItemName(event.target.value)}
                  />

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Additional price"
                    value={newItemPrice}
                    onChange={(event) => setNewItemPrice(event.target.value)}
                  />

                  <button onClick={() => handleAddOptionItem(group.id)}>
                    Add Option
                  </button>
                </div>

                {/* -----------------------------
                    Option Item list
                ------------------------------ */}

                {groupItems.length > 0 ? (
                  groupItems.map((item) => (
                    <div key={item.id}>
                      {editingItemId === item.id ? (
                        <>
                          {/* Edit Option Item */}

                          <input
                            type="text"
                            value={editItemName}
                            onChange={(event) =>
                              setEditItemName(event.target.value)
                            }
                          />

                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editItemPrice}
                            onChange={(event) =>
                              setEditItemPrice(event.target.value)
                            }
                          />

                          <button onClick={() => handleSaveItemEdit(item.id)}>
                            Save
                          </button>

                          <button onClick={handleCancelItemEdit}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <span>
                            {item.name} — ${" "}
                            {(item.additionalPrice / 100).toFixed(2)}
                          </span>

                          <button onClick={() => handleStartItemEdit(item)}>
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteOptionItem(item.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No options yet.</p>
                )}
              </>
            )}

            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default OptionManagement;
