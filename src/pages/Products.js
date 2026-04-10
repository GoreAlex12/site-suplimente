import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { supplementApi, categoryApi } from "../services/api";
import SupplementCard from "../components/SupplementCard";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("category") || "";
  const group = searchParams.get("group") || "";

  const [supplements, setSupplements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    categoryApi.list().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = {};
    if (categoryId) params.category = categoryId;
    supplementApi
      .list(params)
      .then((data) => {
        // If filtering by group (e.g. "suplimente") AND at least one
        // supplement actually has a category tagged with that group, apply
        // the filter. Otherwise show everything — this way the navbar group
        // buttons still work for databases where the `group` field hasn't
        // been filled in yet.
        if (group && !categoryId) {
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
  }, [categoryId, group]);

  const activeCategory = useMemo(
    () => categories.find((c) => c._id === categoryId),
    [categories, categoryId]
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {activeCategory ? activeCategory.name : "Toate suplimentele"}
          </h1>
          <p className="text-gray-500 mt-1">
            {supplements.length} produse
          </p>
        </div>

        <select
          value={categoryId}
          onChange={(e) => {
            const v = e.target.value;
            const next = new URLSearchParams(searchParams);
            if (v) next.set("category", v);
            else next.delete("category");
            setSearchParams(next);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Toate categoriile</option>
          {rootCategories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <Loader />}
      {error && <Message type="error">{error}</Message>}
      {!loading && !error && supplements.length === 0 && (
        <Message type="info">Niciun supliment gasit.</Message>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {supplements.map((s) => (
          <SupplementCard key={s._id} supplement={s} />
        ))}
      </div>
    </div>
  );
};

export default Products;
