import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaUser, FaShoppingCart, FaPhone, FaSignOutAlt, FaCogs } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../index.css";
import DropdownMenu from "./DropdownMenu";
import { categoryApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Known groups get a nice label + fixed ordering at the start of the menu.
// Any other group found in the API response (including the fallback "other"
// bucket for root categories without a group) is appended dynamically.
const GROUP_LABELS = {
  produse: "PRODUSE",
  suplimente: "SUPLIMENTE",
  producatori: "BRANDURI",
  afectiuni: "AFECTIUNI",
  other: "CATEGORII",
};

const KNOWN_ORDER = ["produse", "suplimente", "producatori", "afectiuni", "other"];

const labelFor = (group) =>
  GROUP_LABELS[group] || group.toUpperCase();

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const [language, setLanguage] = useState("RO");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubcategoryHovered, setIsSubcategoryHovered] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [dropdownCategories, setDropdownCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);

  const toggleLanguage = () => setLanguage(language === "RO" ? "EN" : "RO");

  const handleNavbarHover = (state) => setIsNavbarHovered(state);
  const handleDropdownHover = (state) => setIsDropdownHovered(state);

  // Load dynamic category tree once
  useEffect(() => {
    let cancelled = false;
    categoryApi
      .tree()
      .then((tree) => {
        if (cancelled) return;
        // Convert tree shape into what DropdownMenu expects:
        // { group: [ { name, id, subcategories: [ { name, id } ] } ] }
        const shaped = {};
        Object.entries(tree).forEach(([group, roots]) => {
          shaped[group] = roots.map((r) => ({
            _id: r._id,
            name: r.name,
            subcategories: (r.subcategories || []).map((s) => ({
              _id: s._id,
              name: s.name,
            })),
          }));
        });
        setDropdownCategories(shaped);
      })
      .catch((err) => {
        console.warn("Failed to load categories:", err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  useEffect(() => {
    setActiveCategory(null);
    setSelectedCategory(null);
  }, [activeDropdown]);

  const submitSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div>
      {/* Bara Alba - Prima Bara */}
      <nav className="navbar">
        <div className="navbar-top">
          <div className="logo-container" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <img src={logo} alt="Logo" className="logo" />
          </div>

          <form className="search-container" onSubmit={submitSearch}>
            <input
              type="text"
              placeholder="Cauta produse, afectiuni sau simptome"
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
              <HiOutlineSearch size={26} strokeWidth={1.9} />
            </button>
          </form>

          <div className="nav-icons">
            <div className="nav-item">
              <FaPhone className="icon-outline phone-icon" />
              <span>0772 027 622</span>
            </div>
            <div className="nav-item">
              <FaHeart className="icon-outline" />
              <span>FAVORITE</span>
            </div>
            {user ? (
              <>
                <div className="nav-item" onClick={() => navigate("/admin")}>
                  <FaCogs className="icon-outline" />
                  <span>ADMIN</span>
                </div>
                <div
                  className="nav-item"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <FaSignOutAlt className="icon-outline" />
                  <span>IESIRE</span>
                </div>
              </>
            ) : (
              <div className="nav-item" onClick={() => navigate("/login")}>
                <FaUser className="icon-outline" />
                <span>CONECTARE</span>
              </div>
            )}
            <div className="nav-item" onClick={() => navigate("/cart")}>
              <FaShoppingCart className="icon-outline" />
              <span>COS({totalCount})</span>
            </div>
            <div className="nav-item language-toggle" onClick={toggleLanguage}>
              <span className="flag-icon">{language === "RO" ? "🇷🇴" : "🇬🇧"}</span>
              <span>{language}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Wrapper */}
      <div
        onMouseEnter={() => handleNavbarHover(true)}
        onMouseLeave={() => {
          handleNavbarHover(false);
          handleDropdownHover(false);
          setIsSubcategoryHovered(false);
        }}
      >
        {/* Bara Verde */}
        <div className="navbar-bottom">
          <ul className="nav-menu">
            <li onClick={() => navigate("/")}>ACASA</li>

            {/* Only render category groups that actually have at least one
                root category in the API response. Known groups come first in
                a fixed order, then any extra groups are appended. The
                "afectiuni" entry is handled separately below as a permanent
                link to the diseases page. */}
            {(() => {
              const present = Object.keys(dropdownCategories).filter(
                (g) => g !== "afectiuni" && (dropdownCategories[g] || []).length > 0
              );
              const sorted = [
                ...KNOWN_ORDER.filter(
                  (g) => g !== "afectiuni" && present.includes(g)
                ),
                ...present.filter((g) => !KNOWN_ORDER.includes(g)),
              ];
              return sorted.map((group) => (
                <li
                  key={group}
                  className={`dropdown ${activeDropdown === group ? "menu-item--active" : ""}`}
                  onMouseEnter={() => setActiveDropdown(group)}
                  onClick={() => navigate(`/products?group=${group}`)}
                >
                  {labelFor(group)}{" "}
                  <span className={`triangle ${activeDropdown === group ? "triangle--active" : ""}`}></span>
                </li>
              ));
            })()}

            {/* AFECTIUNI — simple link, no dropdown */}
            <li
              onMouseEnter={() => setActiveDropdown(null)}
              onClick={() => navigate("/diseases")}
            >
              AFECTIUNI
            </li>

            <li>BLOG DE SANATATE</li>
            <li>CONTACT</li>
          </ul>
        </div>

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
          onSelectCategory={(cat) => {
            setActiveDropdown(null);
            if (activeDropdown === "afectiuni") {
              navigate(`/diseases`);
            } else {
              navigate(`/products?category=${cat._id}`);
            }
          }}
          onSelectSubcategory={(sub) => {
            setActiveDropdown(null);
            if (activeDropdown === "afectiuni") {
              navigate(`/diseases?symptom=${encodeURIComponent(sub.name)}`);
            } else {
              navigate(`/products?category=${sub._id}`);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
