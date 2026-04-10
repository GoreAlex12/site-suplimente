import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supplementApi, categoryApi, diseaseApi } from "../../services/api";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const emptyForm = {
  name: "",
  description: "",
  price: "",
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

        <div className="grid md:grid-cols-2 gap-3">
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

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 w-14"></th>
                <th className="p-3">Nume</th>
                <th className="p-3">Pret</th>
                <th className="p-3">Categorii</th>
                <th className="p-3">Afectiuni</th>
                <th className="p-3">Click</th>
                <th className="p-3">Cos</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {supplements.map((s) => (
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
              {supplements.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-3 text-gray-400 text-center">
                    Niciun supliment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SupplementsAdmin;
