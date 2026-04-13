import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { supplementApi, categoryApi, diseaseApi } from "../../services/api";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const PER_PAGE = 20;

const SORT_OPTIONS = [
  { value: "name_asc", label: "Nume A → Z" },
  { value: "name_desc", label: "Nume Z → A" },
  { value: "price_asc", label: "Pret crescator" },
  { value: "price_desc", label: "Pret descrescator" },
  { value: "clicks", label: "Cele mai accesate" },
  { value: "cart", label: "Cele mai adaugate in cos" },
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  promoPrice: "",
  image: "",
  categories: [],
  diseases: [],
  benefits: "",
  sideEffects: "",
};

const SupplementsAdmin = () => {
  const [supplements, setSupplements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDisease, setFilterDisease] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...supplements];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((s) => s.name?.toLowerCase().includes(q));
    }
    if (filterCategory) {
      result = result.filter((s) =>
        (s.categories || []).some((c) => (c._id || c) === filterCategory)
      );
    }
    if (filterDisease) {
      result = result.filter((s) =>
        (s.diseases || []).some((d) => (d._id || d) === filterDisease)
      );
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc": return (a.name || "").localeCompare(b.name || "");
        case "name_desc": return (b.name || "").localeCompare(a.name || "");
        case "price_asc": return (a.price || 0) - (b.price || 0);
        case "price_desc": return (b.price || 0) - (a.price || 0);
        case "clicks": return (b.clickCount || 0) - (a.clickCount || 0);
        case "cart": return (b.cartCount || 0) - (a.cartCount || 0);
        default: return 0;
      }
    });
    return result;
  }, [supplements, search, filterCategory, filterDisease, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const load = async () => {
    setLoading(true);
    try {
      const [sups, cats, dis] = await Promise.all([
        supplementApi.list(),
        categoryApi.list(),
        diseaseApi.list(),
      ]);
      setSupplements(sups);
      setCategories(cats);
      setDiseases(dis);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const toArr = (s) =>
    (s || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim()) {
      setError("Numele este obligatoriu");
      return;
    }
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description,
        price: Number(form.price) || 0,
        promoPrice: form.promoPrice !== "" ? Number(form.promoPrice) : null,
        image: form.image,
        categories: form.categories,
        diseases: form.diseases,
        benefits: toArr(form.benefits),
        sideEffects: toArr(form.sideEffects),
      };
      if (editing) {
        await supplementApi.update(editing._id, payload);
        setSuccess("Supliment actualizat");
      } else {
        await supplementApi.create(payload);
        setSuccess("Supliment creat");
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (s) => {
    setEditing(s);
    setForm({
      name: s.name || "",
      description: s.description || "",
      price: s.price || "",
      promoPrice: s.promoPrice != null ? s.promoPrice : "",
      image: s.image || "",
      categories: (s.categories || []).map((c) => c._id || c),
      diseases: (s.diseases || []).map((d) => d._id || d),
      benefits: (s.benefits || []).join("\n"),
      sideEffects: (s.sideEffects || []).join("\n"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Sterge suplimentul "${s.name}"?`)) return;
    try {
      await supplementApi.remove(s._id);
      setSuccess("Supliment sters");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleMulti = (field, id) => {
    setForm((f) => {
      const exists = f[field].includes(id);
      return {
        ...f,
        [field]: exists ? f[field].filter((x) => x !== id) : [...f[field], id],
      };
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Suplimente</h2>

      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">
          {editing ? "Editeaza supliment" : "Adauga supliment"}
        </h3>

        <div className="grid md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Nume"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Pret (lei)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="number"
            placeholder="Pret promotional (lei) — gol = fara promo"
            value={form.promoPrice}
            onChange={(e) => setForm({ ...form, promoPrice: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <textarea
          placeholder="Descriere"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL imagine
          </label>
          <div className="flex gap-3 items-start">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {form.image && (
              <div className="h-16 w-16 border border-gray-300 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={form.image}
                  alt="preview"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categorii (multi-select)
            </label>
            <div className="border border-gray-300 rounded-lg p-2 max-h-40 overflow-y-auto bg-white">
              {categories.map((c) => (
                <label key={c._id} className="flex items-center gap-2 py-0.5 text-sm">
                  <input
                    type="checkbox"
                    checked={form.categories.includes(c._id)}
                    onChange={() => toggleMulti("categories", c._id)}
                  />
                  <span className={c.parent ? "text-gray-600 pl-4" : "font-medium"}>
                    {c.parent ? `↳ ${c.name}` : c.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Afectiuni (multi-select)
            </label>
            <div className="border border-gray-300 rounded-lg p-2 max-h-40 overflow-y-auto bg-white">
              {diseases.map((d) => (
                <label key={d._id} className="flex items-center gap-2 py-0.5 text-sm">
                  <input
                    type="checkbox"
                    checked={form.diseases.includes(d._id)}
                    onChange={() => toggleMulti("diseases", d._id)}
                  />
                  <span>{d.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <textarea
            placeholder="Beneficii (cate unul pe linie)"
            rows={3}
            value={form.benefits}
            onChange={(e) => setForm({ ...form, benefits: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <textarea
            placeholder="Efecte secundare (cate unul pe linie)"
            rows={3}
            value={form.sideEffects}
            onChange={(e) => setForm({ ...form, sideEffects: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            {editing ? "Salveaza" : "Adauga"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg"
            >
              Renunta
            </button>
          )}
        </div>
      </form>

      {/* Search, filters & sort bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
          <input
            type="text"
            placeholder="Cauta dupa nume..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Toate categoriile</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <select
          value={filterDisease}
          onChange={(e) => { setFilterDisease(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Toate afectiunile</option>
          {diseases.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{filtered.length}</span> rezultate
        </span>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 w-14"></th>
                  <th className="p-3">Nume</th>
                  <th className="p-3">Pret</th>
                  <th className="p-3">Promo</th>
                  <th className="p-3">Categorii</th>
                  <th className="p-3">Afectiuni</th>
                  <th className="p-3">Click</th>
                  <th className="p-3">Cos</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {paged.map((s) => (
                  <tr key={s._id} className="border-t hover:bg-gray-50">
                    <td className="p-2">
                      <div className="h-10 w-10 rounded bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
                        {s.image ? (
                          <img
                            src={s.image}
                            alt=""
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-green-700 text-xs font-bold">
                            {s.name?.[0]?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-medium text-gray-800">{s.name}</td>
                    <td className="p-3">{s.price || "—"}</td>
                    <td className="p-3">
                      {s.promoPrice != null ? (
                        <span className="text-red-600 font-semibold">{s.promoPrice}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3">
                      {(s.categories || []).map((c) => c.name || c).join(", ") || "—"}
                    </td>
                    <td className="p-3">
                      {(s.diseases || []).map((d) => d.name || d).join(", ") || "—"}
                    </td>
                    <td className="p-3">{s.clickCount || 0}</td>
                    <td className="p-3">{s.cartCount || 0}</td>
                    <td className="p-3 whitespace-nowrap">
                      <Link
                        to={`/products/${s._id}`}
                        state={{ from: "/admin/supplements" }}
                        className="text-blue-600 hover:underline mr-2"
                      >
                        Vezi
                      </Link>
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-green-700 hover:underline mr-2"
                      >
                        Editeaza
                      </button>
                      <button
                        onClick={() => handleDelete(s)}
                        className="text-red-600 hover:underline"
                      >
                        Sterge
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="9" className="p-3 text-gray-400 text-center">
                      Niciun supliment gasit.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-1.5 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FaChevronLeft size={11} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 min-w-[2.25rem] px-2 flex items-center justify-center rounded-lg text-sm font-semibold transition ${
                    p === safePage
                      ? "bg-green-600 text-white shadow"
                      : "border border-gray-200 bg-white text-gray-700 hover:border-green-400 hover:text-green-700"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FaChevronRight size={11} />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default SupplementsAdmin;
