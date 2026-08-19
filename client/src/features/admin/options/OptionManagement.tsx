"use client";

import { useState } from "react";
import { mockOptionGroups, mockOptionItems } from "@/data/mockMenuData";
import type { OptionGroup, OptionSelectionType } from "@/types/menu.types";

const OptionManagement = () => {
  const [optionGroups, setOptionGroups] =
    useState<OptionGroup[]>(mockOptionGroups);

  // Add Option Group state
  const [name, setName] = useState("");
  const [selectionType, setSelectionType] =
    useState<OptionSelectionType>("single");
  const [isRequired, setIsRequired] = useState(false);
  const [minSelection, setMinSelection] = useState(0);
  const [maxSelection, setMaxSelection] = useState(1);

  // Edit Option Group state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSelectionType, setEditSelectionType] =
    useState<OptionSelectionType>("single");
  const [editIsRequired, setEditIsRequired] = useState(false);
  const [editMinSelection, setEditMinSelection] = useState(0);
  const [editMaxSelection, setEditMaxSelection] = useState(1);

  const handleAddOptionGroup = () => {
    if (!name.trim()) return;
    if (minSelection < 0) return;
    if (maxSelection < 1) return;
    if (minSelection > maxSelection) return;

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
      menuItemIds: [],
    };

    setOptionGroups((prev) => [...prev, newOptionGroup]);

    setName("");
    setSelectionType("single");
    setIsRequired(false);
    setMinSelection(0);
    setMaxSelection(1);
  };

  const handleStartEdit = (group: OptionGroup) => {
    setEditingId(group.id);
    setEditName(group.name);
    setEditSelectionType(group.selectionType);
    setEditIsRequired(group.isRequired);
    setEditMinSelection(group.minSelection);
    setEditMaxSelection(group.maxSelection);
  };

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

    setEditingId(null);
    setEditName("");
    setEditSelectionType("single");
    setEditIsRequired(false);
    setEditMinSelection(0);
    setEditMaxSelection(1);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSelectionType("single");
    setEditIsRequired(false);
    setEditMinSelection(0);
    setEditMaxSelection(1);
  };

  const handleDeleteOptionGroup = (id: string) => {
    setOptionGroups((prev) => prev.filter((group) => group.id !== id));
  };

  return (
    <div>
      <h1>Option Management</h1>

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

      {optionGroups.map((group) => {
        const groupItems = mockOptionItems.filter(
          (item) => item.optionGroupId === group.id,
        );

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
                <h2>{group.name}</h2>

                <p>Selection Type: {group.selectionType}</p>

                <p>Required: {group.isRequired ? "Yes" : "No"}</p>

                <p>Min Selection: {group.minSelection}</p>
                <p>Max Selection: {group.maxSelection}</p>

                <button onClick={() => handleStartEdit(group)}>Edit</button>
                <button onClick={() => handleDeleteOptionGroup(group.id)}>
                  Delete
                </button>

                <h3>Options</h3>

                {groupItems.length > 0 ? (
                  groupItems.map((item) => (
                    <div key={item.id}>
                      {item.name} — ${(item.additionalPrice / 100).toFixed(2)}
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
