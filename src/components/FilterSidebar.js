import React, { useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

// Reusable filter panel for the Products and Search pages.
//
// Props:
//   filters         — { minPrice, maxPrice, disease, hasPrice, category }
//   onChange(next)  — called with the next full filters object
//   onReset()       — clear all filters
//   diseases        — array of { _id, name } for the disease selector
//   categories      — array of root categories for the category selector
//   showCategory    — whether to render the category dropdown (Products page)
//   resultCount     — current number of matching products (shown in mobile bar)
const FilterSidebar = ({
  filters,
  onChange,
  onReset,
  diseases = [],
  categories = [],
  showCategory = false,
  resultCount = null,
}) => {
  const [openMobile, setOpenMobile] = useState(false);

  const set = (patch) => onChange({ ...filters, ...patch });

  const activeCount = [
    filters.minPrice,
    filters.maxPrice,
    filters.disease,
    filters.hasPrice ? "1" : "",
    showCategory ? filters.category : "",
  ].filter((v) => v !== undefined && v !== null && v !== "").length;

  const panel = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-lg">Filtre</h3>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-green-700 hover:text-green-800 font-semibold"
          >
            Reseteaza
          </button>
        )}
      </div>

      {showCategory && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Categorie
          </label>
          <select
            value={filters.category || ""}
            onChange={(e) => set({ category: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Toate categoriile</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Pret (lei)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="min"
            value={filters.minPrice || ""}
            onChange={(e) => set({ minPrice: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            min="0"
            placeholder="max"
            value={filters.maxPrice || ""}
            onChange={(e) => set({ maxPrice: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <label className="flex items-center gap-2 mt-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.hasPrice}
            onChange={(e) => set({ hasPrice: e.target.checked })}
            className="rounded text-green-600 focus:ring-green-500"
          />
          Doar cu pret afisat
        </label>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Afectiune
        </label>
        <select
          value={filters.disease || ""}
          onChange={(e) => set({ disease: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Toate afectiunile</option>
          {diseases.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger bar */}
      <div className="lg:hidden mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpenMobile(true)}
          className="inline-flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-green-500"
        >
          <FaFilter size={12} />
          Filtre
          {activeCount > 0 && (
            <span className="bg-green-600 text-white text-xs rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
        {resultCount !== null && (
          <span className="text-sm text-gray-500">{resultCount} rezultate</span>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block bg-white rounded-2xl shadow p-5 h-fit sticky top-6">
        {panel}
      </aside>

      {/* Mobile drawer */}
      {openMobile && (
        <div className="lg:hidden fixed inset-0 z-[1100] flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenMobile(false)}
          ></div>
          <div className="relative ml-auto w-80 max-w-[88%] h-full bg-white shadow-xl p-5 overflow-y-auto">
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-800"
              aria-label="Inchide filtre"
            >
              <FaTimes />
            </button>
            {panel}
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg"
            >
              Aplica
              {resultCount !== null ? ` (${resultCount})` : ""}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
