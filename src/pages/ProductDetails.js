import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { supplementApi } from "../services/api";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { addItem, getItem } = useCart();

  // If the user arrived from an admin page (or any other page), that page
  // passes `state: { from: "/admin/..." }` so we can render a back link that
  // returns there. Fall back to the public products listing otherwise.
  const from = location.state?.from || "/products";
  const backLabel = from.startsWith("/admin")
    ? "Inapoi la panoul admin"
    : "Inapoi la produse";
  const [supplement, setSupplement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMsg, setCartMsg] = useState("");
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);

  const inCartItem = getItem(id);

  useEffect(() => {
    setLoading(true);
    supplementApi
      .get(id)
      .then(setSupplement)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    if (!supplement) return;
    addItem(supplement, qty);
    supplementApi.trackCart(id).catch(() => {});
    setCartMsg(`${qty} x ${supplement.name} adaugat in cos!`);
    setTimeout(() => setCartMsg(""), 2500);
  };

  if (loading) return <Loader />;
  if (error) return <div className="max-w-5xl mx-auto p-6"><Message type="error">{error}</Message></div>;
  if (!supplement) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link to={from} className="text-green-700 hover:underline mb-4 inline-block">
        &larr; {backLabel}
      </Link>

      {cartMsg && <Message type="success">{cartMsg}</Message>}

      <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow p-6">
        <div className="h-72 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center overflow-hidden">
          {supplement.image && !imgError ? (
            <img
              src={supplement.image}
              alt={supplement.name}
              className="h-full w-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-green-700 font-bold text-7xl">
              {supplement.name?.[0]?.toUpperCase()}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-800">
              {supplement.name}
            </h1>
            {inCartItem && (
              <span className="flex-shrink-0 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                <FaCheck size={10} />
                In cos ({inCartItem.qty})
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 mb-4">
            {(supplement.categories || []).map((c) => c.name).join(" • ")}
          </div>

          <p className="text-gray-700 mb-4">{supplement.description}</p>

          {supplement.price ? (
            <div className="text-3xl font-bold text-green-700 mb-4">
              {supplement.price} lei
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-gray-100 text-gray-700 font-bold"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  setQty(Number.isFinite(n) && n > 0 ? n : 1);
                }}
                className="w-12 text-center outline-none"
              />
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 hover:bg-gray-100 text-gray-700 font-bold"
              >
                +
              </button>
            </div>
            <button
              onClick={addToCart}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg transition"
            >
              {inCartItem ? `Mai adauga ${qty}` : "Adauga in cos"}
            </button>
            {inCartItem && (
              <Link
                to="/cart"
                className="text-green-700 hover:underline text-sm font-medium"
              >
                Vezi cosul →
              </Link>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Vizualizari: <span className="font-semibold">{supplement.clickCount || 0}</span>
            {" · "}
            Adaugari in cos: <span className="font-semibold">{supplement.cartCount || 0}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Beneficii</h2>
          {supplement.benefits?.length ? (
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {supplement.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          ) : (
            <p className="text-gray-400">—</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Efecte secundare</h2>
          {supplement.sideEffects?.length ? (
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {supplement.sideEffects.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          ) : (
            <p className="text-gray-400">—</p>
          )}
        </div>
      </div>

      {supplement.diseases?.length ? (
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Recomandat pentru
          </h2>
          <div className="flex flex-wrap gap-2">
            {supplement.diseases.map((d) => (
              <Link
                key={d._id}
                to={`/diseases/${d._id}`}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-200"
              >
                {d.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;
