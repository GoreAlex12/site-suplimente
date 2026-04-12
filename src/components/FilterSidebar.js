import React, { useState } from "react";
import { FaFilter, FaTimes, FaSlidersH } from "react-icons/fa";

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

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition placeholder:text-gray-400";

  const panel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaSlidersH size={14} className="text-green-700" />
          <h3 className="font-bold text-gray-900">Filtre</h3>
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-red-500 hover:text-red-600 font-semibold transition"
          >
            Reseteaza
          </button>
        )}
      </div>

      {showCategory && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Categorie
          </label>
          <select
            value={filters.category || ""}
            onChange={(e) => set({ category: e.target.value })}
            className={inputClass + " cursor-pointer"}
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
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Pret (lei)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => set({ minPrice: e.target.value })}
            className={inputClass}
          />
          <span className="text-gray-300 text-sm">—</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => set({ maxPrice: e.target.value })}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2.5 mt-3 text-sm text-gray-600 cursor-pointer group">
          <input
            type="checkbox"
            checked={!!filters.hasPrice}
            onChange={(e) => set({ hasPrice: e.target.checked })}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
          />
          <span className="group-hover:text-gray-800 transition">
            Doar cu pret afisat
          </span>
        </label>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Afectiune
        </label>
        <select
          value={filters.disease || ""}
          onChange={(e) => set({ disease: e.target.value })}
          className={inputClass + " cursor-pointer"}
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
      {/* Mobile trigger */}
      <div className="lg:hidden mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpenMobile(true)}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-green-400 hover:shadow transition-all"
        >
          <FaFilter size={12} className="text-green-700" />
          Filtre
          {activeCount > 0 && (
            <span className="bg-green-600 text-white text-[11px] rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </button>
        {resultCount !== null && (
          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{resultCount}</span> rezultate
          </span>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
        {panel}
      </aside>

      {/* Mobile drawer */}
      {openMobile && (
        <div className="lg:hidden fixed inset-0 z-[1100] flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpenMobile(false)}
          />
          <div className="relative ml-auto w-80 max-w-[88%] h-full bg-white shadow-2xl p-6 overflow-y-auto">
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 transition"
              aria-label="Inchide filtre"
            >
              <FaTimes size={16} />
            </button>
            {panel}
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              Aplica filtrele
              {resultCount !== null ? ` (${resultCount})` : ""}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
