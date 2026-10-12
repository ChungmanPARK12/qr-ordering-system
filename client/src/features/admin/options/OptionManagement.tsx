"use client";

import { useEffect, useState } from "react";
import { getAdminOptionGroups } from "@/lib/api/adminOptionApi";
import { mockMenuItems } from "@/data/mockMenuData";

import type {
  OptionGroup,
  OptionItem,
  OptionSelectionType,
} from "@/types/menu.types";

const RESTAURANT_ID = "restaurant-1"; // 실제 DB ID로 교체 필요

const OptionManagement = () => {
  // -----------------------------
  // Option Group list state
  // -----------------------------
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getAdminOptionGroups(RESTAURANT_ID);

        if (cancelled) return;

        setOptionGroups(data);
      } catch (error) {
        if (cancelled) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load option groups.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // -----------------------------
  // Temporary Menu assignment state
  // Day 4: Backend integration
  // -----------------------------
  const [menuAssignments, setMenuAssignments] = useState<
    Record<string, string[]>
  >({
    "option-group-1": ["menu-1", "menu-2", "menu-4"],
    "option-group-2": ["menu-1", "menu-2"],
    "option-group-3": ["menu-4"],
  });

  // -----------------------------
  // Add Option Group state
  // -----------------------------
  const [name, setName] = useState("");

  const [selectionType, setSelectionType] =
    useState<OptionSelectionType>("SINGLE");

  const [isRequired, setIsRequired] = useState(false);
  const [minSelection, setMinSelection] = useState(0);
  const [maxSelection, setMaxSelection] = useState(1);

  // -----------------------------
  // Edit Option Group state
  // -----------------------------
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const [editSelectionType, setEditSelectionType] =
    useState<OptionSelectionType>("SINGLE");

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
  // Temporary local-only handler
  // -----------------------------
  const handleAddOptionGroup = () => {
    if (!name.trim()) return;
    if (minSelection < 0) return;
    if (maxSelection < 1) return;
    if (minSelection > maxSelection) return;

    if (selectionType === "SINGLE" && maxSelection !== 1) {
      return;
    }

    const id = `option-group-${Date.now()}`;

    const newOptionGroup: OptionGroup = {
      id,
      name: name.trim(),
      selectionType,
      isRequired,
      minSelection,
      maxSelection,
      sortOrder: optionGroups.length + 1,
      restaurantId: RESTAURANT_ID,
      optionItems: [],
    };

    setOptionGroups((prev) => [...prev, newOptionGroup]);

    setMenuAssignments((prev) => ({
      ...prev,
      [id]: [],
    }));

    setName("");
    setSelectionType("SINGLE");
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
  // Temporary local-only handler
  // -----------------------------
  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    if (editMinSelection < 0) return;
    if (editMaxSelection < 1) return;
    if (editMinSelection > editMaxSelection) return;

    if (editSelectionType === "SINGLE" && editMaxSelection !== 1) {
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

    setEditingId(null);
    setEditName("");
    setEditSelectionType("SINGLE");
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
    setEditSelectionType("SINGLE");
    setEditIsRequired(false);
    setEditMinSelection(0);
    setEditMaxSelection(1);
  };

  // -----------------------------
  // Delete Option Group
  // Temporary local-only handler
  // -----------------------------
  const handleDeleteOptionGroup = (id: string) => {
    setOptionGroups((prev) => prev.filter((group) => group.id !== id));

    setMenuAssignments((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // -----------------------------
  // Add Option Item
  // Temporary local-only handler
  // -----------------------------
  const handleAddOptionItem = (optionGroupId: string) => {
    if (!newItemName.trim()) return;

    const additionalPriceInCents = Math.round(Number(newItemPrice) * 100);

    if (Number.isNaN(additionalPriceInCents) || additionalPriceInCents < 0) {
      return;
    }

    const groupItemCount =
      optionGroups.find((group) => group.id === optionGroupId)?.optionItems
        .length ?? 0;

    const newOptionItem: OptionItem = {
      id: `option-item-${Date.now()}`,
      name: newItemName.trim(),
      additionalPrice: additionalPriceInCents,
      sortOrder: groupItemCount + 1,
      optionGroupId,
    };

    setOptionGroups((prev) =>
      prev.map((group) =>
        group.id === optionGroupId
          ? {
              ...group,
              optionItems: [...group.optionItems, newOptionItem],
            }
          : group,
      ),
    );

    setNewItemName("");
    setNewItemPrice("");
  };

  // -----------------------------
  // Start Option Item edit
  // -----------------------------
  const handleStartItemEdit = (item: OptionItem) => {
    setEditingItemId(item.id);
    setEditItemName(item.name);
    setEditItemPrice((item.additionalPrice / 100).toFixed(2));
  };

  // -----------------------------
  // Save Option Item edit
  // Temporary local-only handler
  // -----------------------------
  const handleSaveItemEdit = (id: string) => {
    if (!editItemName.trim()) return;

    const additionalPriceInCents = Math.round(Number(editItemPrice) * 100);

    if (Number.isNaN(additionalPriceInCents) || additionalPriceInCents < 0) {
      return;
    }

    setOptionGroups((prev) =>
      prev.map((group) => ({
        ...group,
        optionItems: group.optionItems.map((item) =>
          item.id === id
            ? {
                ...item,
                name: editItemName.trim(),
                additionalPrice: additionalPriceInCents,
              }
            : item,
        ),
      })),
    );

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
  // Temporary local-only handler
  // -----------------------------
  const handleDeleteOptionItem = (id: string) => {
    setOptionGroups((prev) =>
      prev.map((group) => ({
        ...group,
        optionItems: group.optionItems.filter((item) => item.id !== id),
      })),
    );
  };

  // -----------------------------
  // Attach / Detach Menu Item
  // Day 4: Backend integration
  // -----------------------------
  const handleToggleMenuAssignment = (
    optionGroupId: string,
    menuItemId: string,
  ) => {
    setMenuAssignments((prev) => {
      const assignedMenuIds = prev[optionGroupId] ?? [];

      const isAssigned = assignedMenuIds.includes(menuItemId);

      return {
        ...prev,
        [optionGroupId]: isAssigned
          ? assignedMenuIds.filter((id) => id !== menuItemId)
          : [...assignedMenuIds, menuItemId],
      };
    });
  };

  return (
    <div>
      <h1>Option Management</h1>

      {isLoading && <p>Loading option groups...</p>}

      {errorMessage && <p role="alert">{errorMessage}</p>}

      {/* Add Option Group */}
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

            if (type === "SINGLE") {
              setMaxSelection(1);

              if (minSelection > 1) {
                setMinSelection(1);
              }
            }
          }}
        >
          <option value="SINGLE">Single</option>
          <option value="MULTIPLE">Multiple</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={isRequired}
            onChange={(event) => {
              const required = event.target.checked;

              setIsRequired(required);

              if (required && minSelection === 0) {
                setMinSelection(1);
              }

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
          max={selectionType === "SINGLE" ? 1 : undefined}
          value={minSelection}
          onChange={(event) => setMinSelection(Number(event.target.value))}
          placeholder="Min selection"
        />

        <input
          type="number"
          min="1"
          max={selectionType === "SINGLE" ? 1 : undefined}
          value={maxSelection}
          onChange={(event) => setMaxSelection(Number(event.target.value))}
          placeholder="Max selection"
          disabled={selectionType === "SINGLE"}
        />

        <button onClick={handleAddOptionGroup}>Add Option Group</button>
      </div>

      <hr />

      {/* Option Group list */}
      {optionGroups.map((group) => {
        const groupItems = group.optionItems;

        const assignedMenuIds = menuAssignments[group.id] ?? [];

        return (
          <div key={group.id}>
            {editingId === group.id ? (
              <>
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

                    if (type === "SINGLE") {
                      setEditMaxSelection(1);

                      if (editMinSelection > 1) {
                        setEditMinSelection(1);
                      }
                    }
                  }}
                >
                  <option value="SINGLE">Single</option>
                  <option value="MULTIPLE">Multiple</option>
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
                  max={editSelectionType === "SINGLE" ? 1 : undefined}
                  value={editMinSelection}
                  onChange={(event) =>
                    setEditMinSelection(Number(event.target.value))
                  }
                />

                <input
                  type="number"
                  min="1"
                  max={editSelectionType === "SINGLE" ? 1 : undefined}
                  value={editMaxSelection}
                  onChange={(event) =>
                    setEditMaxSelection(Number(event.target.value))
                  }
                  disabled={editSelectionType === "SINGLE"}
                />

                <button onClick={() => handleSaveEdit(group.id)}>Save</button>

                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <h2>{group.name}</h2>

                <p>Selection Type: {group.selectionType}</p>

                <p>Required: {group.isRequired ? "Yes" : "No"}</p>

                <p>Min Selection: {group.minSelection}</p>

                <p>Max Selection: {group.maxSelection}</p>

                <button onClick={() => handleStartEdit(group)}>Edit</button>

                <button onClick={() => handleDeleteOptionGroup(group.id)}>
                  Delete
                </button>

                <h3>Assigned Menus</h3>

                {mockMenuItems.map((menuItem) => (
                  <label key={menuItem.id} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      checked={assignedMenuIds.includes(menuItem.id)}
                      onChange={() =>
                        handleToggleMenuAssignment(group.id, menuItem.id)
                      }
                    />
                    {menuItem.name}
                  </label>
                ))}

                <h3>Options</h3>

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

                {groupItems.length > 0 ? (
                  groupItems.map((item) => (
                    <div key={item.id}>
                      {editingItemId === item.id ? (
                        <>
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
                            {item.name} — $
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
