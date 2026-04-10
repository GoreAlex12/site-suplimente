import React, { useEffect, useState } from "react";
import { categoryApi } from "../../services/api";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const emptyForm = { name: "", parent: "" };

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(null); // category doc or null
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const data = await categoryApi.list();
      setCategories(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const rootCategories = categories.filter((c) => !c.parent);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
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
        parent: form.parent || null,
      };
      if (editing) {
        await categoryApi.update(editing._id, payload);
        setSuccess("Categorie actualizata");
      } else {
        await categoryApi.create(payload);
        setSuccess("Categorie creata");
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      parent: cat.parent?._id || cat.parent || "",
    });
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Sterge categoria "${cat.name}"? Subcategoriile vor fi sterse.`)) return;
    try {
      await categoryApi.remove(cat._id);
      setSuccess("Categorie stearsa");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categorii</h2>

      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">
          {editing ? "Editeaza categoria" : "Adauga categorie"}
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Nume categorie"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <select
            value={form.parent}
            onChange={(e) => setForm({ ...form, parent: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Categorie radacina</option>
            {rootCategories.map((c) => (
              <option key={c._id} value={c._id}>
                Sub: {c.name}
              </option>
            ))}
          </select>
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
        <div className="space-y-4">
          {rootCategories.map((root) => {
            const subs = categories.filter(
              (c) => (c.parent?._id || c.parent)?.toString() === root._id.toString()
            );
            return (
              <div key={root._id} className="border rounded-lg">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg">
                  <div>
                    <span className="font-semibold text-gray-800">{root.name}</span>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(root)}
                      className="text-green-700 hover:underline text-sm"
                    >
                      Editeaza
                    </button>
                    <button
                      onClick={() => handleDelete(root)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Sterge
                    </button>
                  </div>
                </div>
                {subs.length > 0 && (
                  <ul className="divide-y">
                    {subs.map((s) => (
                      <li key={s._id} className="flex items-center justify-between p-3">
                        <span className="text-gray-700 pl-4">↳ {s.name}</span>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEdit(s)}
                            className="text-green-700 hover:underline text-sm"
                          >
                            Editeaza
                          </button>
                          <button
                            onClick={() => handleDelete(s)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Sterge
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          {rootCategories.length === 0 && (
            <Message type="info">Nicio categorie inregistrata.</Message>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesAdmin;
