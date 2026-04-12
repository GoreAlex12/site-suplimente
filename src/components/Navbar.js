import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaShoppingCart, FaPhone, FaSignOutAlt, FaCogs, FaBars, FaTimes } from "react-icons/fa";
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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubcategoryHovered, setIsSubcategoryHovered] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [dropdownCategories, setDropdownCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const goMobile = (path) => {
    closeMobileMenu();
    navigate(path);
  };

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

  const submitSearchMobile = (e) => {
    submitSearch(e);
    closeMobileMenu();
  };

  return (
    <div>
      {/* Bara Alba - Prima Bara */}
      <nav className="navbar">
        <div className="navbar-top">
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label="Meniu"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

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
            <div className="nav-item nav-item-cart" onClick={() => navigate("/cart")}>
              <FaShoppingCart className="icon-outline" />
              <span>COS({totalCount})</span>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <form className="mobile-search" onSubmit={submitSearchMobile}>
              <input
                type="text"
                placeholder="Cauta produse, afectiuni sau simptome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" aria-label="Cauta">
                <HiOutlineSearch size={22} strokeWidth={1.9} />
              </button>
            </form>

            <ul className="mobile-nav-links">
              <li onClick={() => goMobile("/")}>ACASA</li>
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

                if (sorted.length === 0) {
                  return (
                    <li onClick={() => goMobile("/products")}>CATEGORII</li>
                  );
                }

                return sorted.map((group) => (
                  <li key={group} onClick={() => goMobile(`/products?group=${group}`)}>
                    {labelFor(group)}
                  </li>
                ));
              })()}
              <li onClick={() => goMobile("/diseases")}>AFECTIUNI</li>
              <li onClick={() => goMobile("/despre-noi")}>DESPRE NOI</li>
              <li onClick={() => goMobile("/contact")}>CONTACT</li>
            </ul>

            <div className="mobile-nav-actions">
              <a href="tel:+40772027622" className="mobile-action">
                <FaPhone className="phone-icon" />
                <span>0772 027 622</span>
              </a>
              {user ? (
                <>
                  <button type="button" className="mobile-action" onClick={() => goMobile("/admin")}>
                    <FaCogs />
                    <span>ADMIN</span>
                  </button>
                  <button
                    type="button"
                    className="mobile-action"
                    onClick={() => {
                      logout();
                      goMobile("/");
                    }}
                  >
                    <FaSignOutAlt />
                    <span>IESIRE</span>
                  </button>
                </>
              ) : (
                <button type="button" className="mobile-action" onClick={() => goMobile("/login")}>
                  <FaUser />
                  <span>CONECTARE</span>
                </button>
              )}
              <button type="button" className="mobile-action" onClick={() => goMobile("/cart")}>
                <FaShoppingCart />
                <span>COS ({totalCount})</span>
              </button>
            </div>
          </div>
        )}
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

            {/* Category groups — if the tree hasn't loaded yet, show a
                single "CATEGORII" link so the bar is never empty. */}
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

              if (sorted.length === 0) {
                return (
                  <li onClick={() => navigate("/products")}>
                    CATEGORII
                  </li>
                );
              }

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

            <li
              onMouseEnter={() => setActiveDropdown(null)}
              onClick={() => navigate("/despre-noi")}
            >
              DESPRE NOI
            </li>

            <li onClick={() => navigate("/contact")}>CONTACT</li>
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
