"use client";

import { useState } from "react";
import { mockOptionGroups, mockOptionItems } from "@/data/mockMenuData";
import type { OptionGroup } from "@/types/menu.types";

const OptionManagement = () => {
  const [optionGroups, setOptionGroups] =
    useState<OptionGroup[]>(mockOptionGroups);

  return (
    <div>
      <h1>Option Management</h1>

      {optionGroups.map((group) => {
        const groupItems = mockOptionItems.filter(
          (item) => item.optionGroupId === group.id,
        );

        return (
          <div key={group.id}>
            <h2>{group.name}</h2>

            <p>Selection Type: {group.selectionType}</p>

            <p>Required: {group.isRequired ? "Yes" : "No"}</p>

            <p>Min Selection: {group.minSelection}</p>
            <p>Max Selection: {group.maxSelection}</p>

            <h3>Options</h3>

            {groupItems.map((item) => (
              <div key={item.id}>
                {item.name} — ${(item.additionalPrice / 100).toFixed(2)}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default OptionManagement;
