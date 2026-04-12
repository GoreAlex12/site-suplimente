import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { supplementApi, categoryApi, diseaseApi } from "../services/api";
import SupplementCard from "../components/SupplementCard";
import FilterSidebar from "../components/FilterSidebar";
import Loader from "../components/Loader";
import Message from "../components/Message";

const PER_PAGE = 20;

const SORT_OPTIONS = [
  { value: "newest", label: "Cele mai noi" },
  { value: "popular", label: "Populare" },
  { value: "price_asc", label: "Pret crescator" },
  { value: "price_desc", label: "Pret descrescator" },
  { value: "name_asc", label: "Nume A → Z" },
  { value: "name_desc", label: "Nume Z → A" },
];

// Read filter values from the URL search params
const filtersFromParams = (sp) => ({
  category: sp.get("category") || "",
  minPrice: sp.get("minPrice") || "",
  maxPrice: sp.get("maxPrice") || "",
  disease: sp.get("disease") || "",
  hasPrice: sp.get("hasPrice") === "true",
});

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const group = searchParams.get("group") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);

  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);

  const [supplements, setSupplements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    categoryApi.list().then(setCategories).catch(() => {});
    diseaseApi.list().then(setDiseases).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = {
      sort,
      ...filters,
      hasPrice: filters.hasPrice ? "true" : "",
    };
    supplementApi
      .list(params)
      .then((data) => {
        // If filtering by group (e.g. "suplimente") AND at least one
        // supplement actually has a category tagged with that group, apply
        // the filter. Otherwise show everything — this way the navbar group
        // buttons still work for databases where the `group` field hasn't
        // been filled in yet.
        if (group && !filters.category) {
          const hasAnyWithGroup = data.some((s) =>
            (s.categories || []).some((c) => c.group === group)
          );
          if (hasAnyWithGroup) {
            setSupplements(
              data.filter((s) =>
                (s.categories || []).some((c) => c.group === group)
              )
            );
          } else {
            setSupplements(data);
          }
        } else {
          setSupplements(data);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filters, group, sort]);

  const activeCategory = useMemo(
    () => categories.find((c) => c._id === filters.category),
    [categories, filters.category]
  );

  // Dropdown of root categories. If the user picked a specific group from the
  // navbar, try to filter to that group first; if nothing matches (legacy data
  // with group=null), fall back to showing all root categories.
  const rootCategories = useMemo(() => {
    const roots = categories.filter((c) => !c.parent);
    if (!group) return roots;
    const inGroup = roots.filter((c) => c.group === group);
    return inGroup.length > 0 ? inGroup : roots;
  }, [categories, group]);

  // Merge a partial filter patch into the URL search params
  const updateFilters = useCallback(
    (next) => {
      const sp = new URLSearchParams(searchParams);
      const all = {
        category: next.category,
        minPrice: next.minPrice,
        maxPrice: next.maxPrice,
        disease: next.disease,
        hasPrice: next.hasPrice ? "true" : "",
      };
      Object.entries(all).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") sp.delete(k);
        else sp.set(k, v);
      });
      sp.delete("page");
      setSearchParams(sp);
    },
    [searchParams, setSearchParams]
  );

  const resetFilters = useCallback(() => {
    const sp = new URLSearchParams(searchParams);
    ["category", "minPrice", "maxPrice", "disease", "hasPrice", "page"].forEach(
      (k) => sp.delete(k)
    );
    setSearchParams(sp);
  }, [searchParams, setSearchParams]);

  const updateSort = (value) => {
    const sp = new URLSearchParams(searchParams);
    if (value && value !== "newest") sp.set("sort", value);
    else sp.delete("sort");
    sp.delete("page");
    setSearchParams(sp);
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(supplements.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = supplements.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const goToPage = (p) => {
    const sp = new URLSearchParams(searchParams);
    if (p <= 1) sp.delete("page");
    else sp.set("page", String(p));
    setSearchParams(sp);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build visible page numbers: always show first, last, current ± 1
  const pageNumbers = useMemo(() => {
    const pages = new Set([1, totalPages]);
    for (let i = Math.max(1, safePage - 1); i <= Math.min(totalPages, safePage + 1); i++) {
      pages.add(i);
    }
    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push(null); // gap
      result.push(sorted[i]);
    }
    return result;
  }, [safePage, totalPages]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            {activeCategory ? activeCategory.name : "Toate suplimentele"}
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm">
            <span className="font-semibold text-green-700">{supplements.length}</span>{" "}
            {supplements.length === 1 ? "produs disponibil" : "produse disponibile"}
          </p>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-green-600 to-emerald-400 rounded-full hidden sm:block" />
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <FilterSidebar
          filters={filters}
          onChange={updateFilters}
          onReset={resetFilters}
          diseases={diseases}
          categories={rootCategories}
          showCategory={true}
          resultCount={supplements.length}
        />

        <div>
          <div className="flex items-center justify-between mb-5 gap-3 bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-3">
            <span className="text-sm text-gray-500 hidden sm:inline">
              Afiseaza{" "}
              <span className="font-semibold text-gray-800">
                {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, supplements.length)}
              </span>{" "}
              din{" "}
              <span className="font-semibold text-gray-800">
                {supplements.length}
              </span>{" "}
              rezultate
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm text-gray-600 hidden sm:inline font-medium">
                Sorteaza:
              </label>
              <select
                value={sort}
                onChange={(e) => updateSort(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white font-medium text-gray-700 cursor-pointer transition"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && <Loader />}
          {error && <Message type="error">{error}</Message>}
          {!loading && !error && supplements.length === 0 && (
            <Message type="info">Niciun supliment gasit.</Message>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paged.map((s) => (
              <SupplementCard key={s._id} supplement={s} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-1.5 mt-10">
              <button
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage <= 1}
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FaChevronLeft size={12} />
              </button>

              {pageNumbers.map((p, i) =>
                p === null ? (
                  <span key={`gap-${i}`} className="px-1 text-gray-400 text-sm select-none">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`h-10 min-w-[2.5rem] px-2 flex items-center justify-center rounded-xl text-sm font-semibold transition ${
                      p === safePage
                        ? "bg-green-600 text-white shadow-md"
                        : "border border-gray-200 bg-white text-gray-700 hover:border-green-400 hover:text-green-700"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage >= totalPages}
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FaChevronRight size={12} />
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
