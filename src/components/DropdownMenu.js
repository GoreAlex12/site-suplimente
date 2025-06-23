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
  dropdownCategories
}) => {
  return (
    activeDropdown && (
      <div
        className="dropdown-content"
        ref={dropdownRef}
        onMouseEnter={() => {
          handleDropdownHover(true);
        }}
        onMouseLeave={() => { 
          handleDropdownHover(false);
        }}
      >
        <div className="dropdown-container">
          <ul className="categories">
            {dropdownCategories[activeDropdown]?.map((category) => (
              <li
                key={category.name}
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
                onClick={() => setSelectedCategory(category.name)} 
              >
                {category.name} <span className="triangle-right">▶</span>
              </li>
            ))}
          </ul>

          <ul className="subcategories"
              onMouseEnter={() => {
                setIsSubcategoryHovered(true);
                if (activeCategory) {
                  setSelectedCategory(activeCategory.name);
                }
              }}
              onMouseLeave={() => setIsSubcategoryHovered(false)}
          >
            {activeCategory?.subcategories?.map((subcategory) => (
              <li key={subcategory}>{subcategory}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  );
};

export default DropdownMenu;