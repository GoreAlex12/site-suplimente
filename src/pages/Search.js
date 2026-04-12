import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaHeartbeat, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { supplementApi, diseaseApi, categoryApi } from "../services/api";
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

const filtersFromParams = (sp) => ({
  category: sp.get("category") || "",
  minPrice: sp.get("minPrice") || "",
  maxPrice: sp.get("maxPrice") || "",
  disease: sp.get("disease") || "",
  hasPrice: sp.get("hasPrice") === "true",
});

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);

  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);

  const [results, setResults] = useState({ supplements: [], diseases: [] });
  const [allDiseases, setAllDiseases] = useState([]);
  const [rootCategories, setRootCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    diseaseApi.list().then(setAllDiseases).catch(() => {});
    categoryApi
      .list()
      .then((cats) => setRootCategories(cats.filter((c) => !c.parent)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!q) {
      setResults({ supplements: [], diseases: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    const params = {
      sort,
      ...filters,
      hasPrice: filters.hasPrice ? "true" : "",
    };
    supplementApi
      .search(q, params)
      .then(setResults)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q, filters, sort]);

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
  const supplements = results.supplements;
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

  const pageNumbers = useMemo(() => {
    const pages = new Set([1, totalPages]);
    for (let i = Math.max(1, safePage - 1); i <= Math.min(totalPages, safePage + 1); i++) {
      pages.add(i);
    }
    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push(null);
      result.push(sorted[i]);
    }
    return result;
  }, [safePage, totalPages]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">
          Rezultate pentru{" "}
          <span className="text-green-700">"{q}"</span>
        </h1>
        <p className="text-gray-500 text-sm">
          <span className="font-semibold text-gray-700">
            {results.supplements.length}
          </span>{" "}
          suplimente{" · "}
          <span className="font-semibold text-gray-700">
            {results.diseases.length}
          </span>{" "}
          afectiuni
        </p>
      </div>

      {error && <Message type="error">{error}</Message>}

      {!loading && results.diseases.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Afectiuni</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.diseases.map((d) => (
              <Link
                key={d._id}
                to={`/diseases/${d._id}`}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 hover:-translate-y-0.5 transition-all p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0 border border-green-100 group-hover:bg-green-100 transition-colors">
                    <FaHeartbeat size={14} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                      {d.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {d.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Suplimente</h2>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          <FilterSidebar
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
            diseases={allDiseases}
            categories={rootCategories}
            showCategory={true}
            resultCount={results.supplements.length}
          />

          <div>
            <div className="flex items-center justify-between mb-5 gap-3 bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-3">
              <span className="text-sm text-gray-500 hidden sm:inline">
                Afiseaza{" "}
                <span className="font-semibold text-gray-800">
                  {supplements.length > 0
                    ? `${(safePage - 1) * PER_PAGE + 1}–${Math.min(safePage * PER_PAGE, supplements.length)}`
                    : "0"}
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
            {!loading && supplements.length === 0 ? (
              <Message type="info">Niciun supliment gasit.</Message>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paged.map((s) => (
                  <SupplementCard key={s._id} supplement={s} />
                ))}
              </div>
            )}

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
      </section>
    </div>
  );
};

export default Search;
