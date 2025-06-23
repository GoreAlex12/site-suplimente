import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaUser, FaShoppingCart, FaPhone } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../index.css";
import { dropdownCategories } from "../data/dropdownData";
import DropdownMenu from "./DropdownMenu";

const Navbar = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("RO");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubcategoryHovered, setIsSubcategoryHovered] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);

  const dropdownRef = useRef(null);

  const toggleLanguage = () => {
    setLanguage(language === "RO" ? "EN" : "RO");
  };

  const handleNavbarHover = (state) => setIsNavbarHovered(state);
  const handleDropdownHover = (state) => setIsDropdownHovered(state);

  useEffect(() => {
    let timer;
    if (!isNavbarHovered && !isDropdownHovered && !isSubcategoryHovered) {
      timer = setTimeout(() => {
        setActiveDropdown(null);
        setActiveCategory(null);
        setSelectedCategory(null);
      }, 200);
    }
    return () => clearTimeout(timer);
  }, [isNavbarHovered, isDropdownHovered, isSubcategoryHovered]);

  // Când se schimbă meniul principal (ex: de la PRODUSE la SUPLIMENTE), resetăm subcategoriile
useEffect(() => {
  setActiveCategory(null);
  setSelectedCategory(null);
}, [activeDropdown]);

  return (
    <div>
      {/* Bara Albă - Prima Bară */}
      <nav className="navbar">
        <div className="navbar-top">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>

          <div className="search-container">
            <input type="text" placeholder="Cauta produse" className="search-bar" />
            <button className="search-button">
              <HiOutlineSearch size={26} strokeWidth={1.9} />
            </button>
          </div>

          <div className="nav-icons">
            <div className="nav-item">
              <FaPhone className="icon-outline phone-icon" />
              <span>0772 027 622</span>
            </div>
            <div className="nav-item">
              <FaHeart className="icon-outline" />
              <span>FAVORITE</span>
            </div>
            <div className="nav-item" onClick={() => navigate("/login")}>
              <FaUser className="icon-outline" />
              <span>CONECTARE</span>
            </div>
            <div className="nav-item" onClick={() => navigate("/cart")}>
              <FaShoppingCart className="icon-outline" />
              <span>COS(0)</span>
            </div>
            <div className="nav-item language-toggle" onClick={toggleLanguage}>
              <span className="flag-icon">{language === "RO" ? "🇷🇴" : "🇬🇧"}</span>
              <span>{language}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Wrapper care include meniul și dropdown-ul */}
      <div
        onMouseEnter={() => handleNavbarHover(true)}
        onMouseLeave={() => {
          handleNavbarHover(false);
          handleDropdownHover(false);
          setIsSubcategoryHovered(false);
        }}
      >
        {/* Bara Verde - A doua Bară */}
        <div className="navbar-bottom">
          <ul className="nav-menu">
            <li onClick={() => navigate("/")}>ACASA</li>

            <li
              className={`dropdown ${activeDropdown === "produse" ? "menu-item--active" : ""}`}
              onMouseEnter={() => setActiveDropdown("produse")}
            >
              PRODUSE <span className={`triangle ${activeDropdown === "produse" ? "triangle--active" : ""}`}></span>
            </li>

            <li
               className={`dropdown ${activeDropdown === "suplimente" ? "menu-item--active" : ""}`}
               onMouseEnter={() => setActiveDropdown("suplimente")}
            >
              SUPLIMENTE <span className={`triangle ${activeDropdown === "suplimente" ? "triangle--active" : ""}`}></span>
            </li>

            <li
              className={`dropdown ${activeDropdown === "producatori" ? "menu-item--active" : ""}`}
              onMouseEnter={() => setActiveDropdown("producatori")}
            >
              BRANDURI <span className={`triangle ${activeDropdown === "producatori" ? "triangle--active" : ""}`}></span>
            </li>      

            <li
              className={`dropdown ${activeDropdown === "afectiuni" ? "menu-item--active" : ""}`}
              onMouseEnter={() => setActiveDropdown("afectiuni")}
            >
              AFECTIUNI <span className={`triangle ${activeDropdown === "afectiuni" ? "triangle--active" : ""}`}></span>
            </li>

            <li>BLOG DE SANATATE</li>
            <li>CONTACT</li>
          </ul>
        </div>

        {/* Dropdown-ul */}
        <DropdownMenu
          setIsSubcategoryHovered={setIsSubcategoryHovered}
          activeDropdown={activeDropdown}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          isSubcategoryHovered={isSubcategoryHovered}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleDropdownHover={handleDropdownHover}
          dropdownRef={dropdownRef}
          dropdownCategories={dropdownCategories}
        />
      </div>
    </div>
  );
};

export default Navbar;
