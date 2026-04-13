import React, { useEffect, useState, useMemo } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { diseaseApi, supplementApi } from "../../services/api";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const PER_PAGE = 20;

const SORT_OPTIONS = [
  { value: "name_asc", label: "Nume A → Z" },
  { value: "name_desc", label: "Nume Z → A" },
  { value: "symptoms_most", label: "Cele mai multe simptome" },
  { value: "symptoms_least", label: "Cele mai putine simptome" },
];

const emptyForm = { name: "", description: "", symptoms: "" };

const DiseasesAdmin = () => {
  const [diseases, setDiseases] = useState([]);
  const [allSupplements, setAllSupplements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [related, setRelated] = useState([]);
  const [addSupId, setAddSupId] = useState("");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...diseases];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((d) => d.name?.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc": return (a.name || "").localeCompare(b.name || "");
        case "name_desc": return (b.name || "").localeCompare(a.name || "");
        case "symptoms_most": return (b.symptoms || []).length - (a.symptoms || []).length;
        case "symptoms_least": return (a.symptoms || []).length - (b.symptoms || []).length;
        default: return 0;
      }
    });
    return result;
  }, [diseases, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const load = async () => {
    setLoading(true);
    try {
      const [dis, sups] = await Promise.all([
        diseaseApi.list(),
        supplementApi.list(),
      ]);
      setDiseases(dis);
      setAllSupplements(sups);
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
    setRelated([]);
    setAddSupId("");
  };

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
        symptoms: form.symptoms
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean),
      };
      if (editing) {
        await diseaseApi.update(editing._id, payload);
        setSuccess("Afectiune actualizata");
      } else {
        await diseaseApi.create(payload);
        setSuccess("Afectiune creata");
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (d) => {
    setEditing(d);
    setForm({
      name: d.name,
      description: d.description || "",
      symptoms: (d.symptoms || []).join("\n"),
    });
    try {
      const res = await diseaseApi.get(d._id);
      setRelated(res.supplements || []);
    } catch (e) {
      setError(e.message);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (d) => {
    if (!window.confirm(`Sterge afectiunea "${d.name}"?`)) return;
    try {
      await diseaseApi.remove(d._id);
      setSuccess("Afectiune stearsa");
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAddSupplement = async () => {
    if (!editing || !addSupId) return;
    try {
      await diseaseApi.addSupplement(editing._id, addSupId);
      const res = await diseaseApi.get(editing._id);
      setRelated(res.supplements);
      setAddSupId("");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleRemoveSupplement = async (supId) => {
    if (!editing) return;
    try {
      await diseaseApi.removeSupplement(editing._id, supId);
      setRelated((r) => r.filter((s) => s._id !== supId));
    } catch (e) {
      setError(e.message);
    }
  };

  const unlinked = allSupplements.filter(
    (s) => !related.some((r) => r._id === s._id)
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Afectiuni</h2>

      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">
          {editing ? "Editeaza afectiune" : "Adauga afectiune"}
        </h3>

        <input
          type="text"
          placeholder="Nume"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <textarea
          placeholder="Descriere"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        <textarea
          placeholder="Simptome (cate unul pe linie)"
          rows={3}
          value={form.symptoms}
          onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />

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

        {editing && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-2">
              Suplimente asociate ({related.length})
            </h4>

            {related.length === 0 && (
              <p className="text-sm text-gray-500 mb-2">Niciun supliment asociat.</p>
            )}
            <ul className="divide-y mb-3 bg-white rounded-lg border">
              {related.map((s) => (
                <li key={s._id} className="flex items-center justify-between p-2">
                  <span className="text-gray-800">{s.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSupplement(s._id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Elimina
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <select
                value={addSupId}
                onChange={(e) => setAddSupId(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">— Alege un supliment de adaugat —</option>
                {unlinked.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddSupplement}
                disabled={!addSupId}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Adauga
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Search, sort bar */}
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
                  <th className="p-3">Nume</th>
                  <th className="p-3">Simptome</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {paged.map((d) => (
                  <tr key={d._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{d.name}</td>
                    <td className="p-3 text-gray-600">
                      {(d.symptoms || []).join(", ") || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(d)}
                        className="text-green-700 hover:underline mr-2"
                      >
                        Editeaza
                      </button>
                      <button
                        onClick={() => handleDelete(d)}
                        className="text-red-600 hover:underline"
                      >
                        Sterge
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-3 text-gray-400 text-center">
                      Nicio afectiune gasita.
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

export default DiseasesAdmin;
