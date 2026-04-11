import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supplementApi, diseaseApi, categoryApi } from "../services/api";
import SupplementCard from "../components/SupplementCard";
import FilterSidebar from "../components/FilterSidebar";
import Loader from "../components/Loader";
import Message from "../components/Message";

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
      setSearchParams(sp);
    },
    [searchParams, setSearchParams]
  );

  const resetFilters = useCallback(() => {
    const sp = new URLSearchParams(searchParams);
    ["category", "minPrice", "maxPrice", "disease", "hasPrice"].forEach((k) =>
      sp.delete(k)
    );
    setSearchParams(sp);
  }, [searchParams, setSearchParams]);

  const updateSort = (value) => {
    const sp = new URLSearchParams(searchParams);
    if (value && value !== "newest") sp.set("sort", value);
    else sp.delete("sort");
    setSearchParams(sp);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        Rezultate pentru "{q}"
      </h1>
      <p className="text-gray-500 mb-6 text-sm">
        {results.supplements.length} suplimente · {results.diseases.length}{" "}
        afectiuni
      </p>

      {error && <Message type="error">{error}</Message>}

      {!loading && results.diseases.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Afectiuni</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.diseases.map((d) => (
              <Link
                key={d._id}
                to={`/diseases/${d._id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 border border-gray-100"
              >
                <h3 className="font-semibold text-gray-800">{d.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {d.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Suplimente</h2>

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
            <div className="flex items-center justify-end mb-4 gap-3">
              <label className="text-sm text-gray-600 hidden sm:inline">
                Sorteaza dupa:
              </label>
              <select
                value={sort}
                onChange={(e) => updateSort(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {loading && <Loader />}
            {!loading && results.supplements.length === 0 ? (
              <Message type="info">Niciun supliment gasit.</Message>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {results.supplements.map((s) => (
                  <SupplementCard key={s._id} supplement={s} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Search;
