// src/components/DropdownMenu.js
import React from "react";

const DropdownMenu = ({
  setIsSubcategoryHovered,
  activeDropdown,
  activeCategory,
  setActiveCategory,
  isSubcategoryHovered,
  selectedCategory,
  setSelectedCategory,
  handleDropdownHover,
  dropdownRef,
  dropdownCategories,
  onSelectCategory,
  onSelectSubcategory,
}) => {
  if (!activeDropdown) return null;
  const items = dropdownCategories[activeDropdown] || [];
  if (items.length === 0) return null;

  return (
    <div
      className="dropdown-content"
      ref={dropdownRef}
      onMouseEnter={() => handleDropdownHover(true)}
      onMouseLeave={() => handleDropdownHover(false)}
    >
      <div className="dropdown-container">
        <ul className="categories">
          {items.map((category) => (
            <li
              key={category._id || category.name}
              className={`expandable ${
                activeCategory?.name === category.name ||
                (isSubcategoryHovered && selectedCategory === category.name)
                  ? "active"
                  : ""
              }`}
              onMouseEnter={() => {
                setActiveCategory(category);
                setIsSubcategoryHovered(false);
              }}
              onClick={() => {
                setSelectedCategory(category.name);
                if (onSelectCategory) onSelectCategory(category);
              }}
            >
              {category.name} <span className="triangle-right">▶</span>
            </li>
          ))}
        </ul>

        <ul
          className="subcategories"
          onMouseEnter={() => {
            setIsSubcategoryHovered(true);
            if (activeCategory) setSelectedCategory(activeCategory.name);
          }}
          onMouseLeave={() => setIsSubcategoryHovered(false)}
        >
          {activeCategory?.subcategories?.map((subcategory) => {
            const name = typeof subcategory === "string" ? subcategory : subcategory.name;
            const key = typeof subcategory === "string" ? subcategory : subcategory._id || subcategory.name;
            return (
              <li
                key={key}
                onClick={() => onSelectSubcategory && onSelectSubcategory(
                  typeof subcategory === "string" ? { name } : subcategory
                )}
              >
                {name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DropdownMenu;
