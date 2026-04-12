import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  FaCheck,
  FaArrowLeft,
  FaShoppingCart,
  FaShippingFast,
  FaShieldAlt,
  FaLeaf,
  FaEye,
  FaHeart,
  FaMinus,
  FaPlus,
  FaExclamationTriangle,
} from "react-icons/fa";
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
  if (error)
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Message type="error">{error}</Message>
      </div>
    );
  if (!supplement) return null;

  const categories = supplement.categories || [];
  const benefits = supplement.benefits || [];
  const sideEffects = supplement.sideEffects || [];
  const diseases = supplement.diseases || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb / Back */}
      <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
        <Link
          to={from}
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-colors"
        >
          <FaArrowLeft size={12} />
          {backLabel}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600 truncate">{supplement.name}</span>
      </div>

      {cartMsg && <Message type="success">{cartMsg}</Message>}

      {/* Main product card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image side */}
          <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-8 md:p-12 flex items-center justify-center min-h-[320px] md:min-h-[480px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.9),transparent_60%)]" />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {supplement.promoPrice != null &&
                supplement.price != null &&
                supplement.promoPrice < supplement.price && (
                  <span className="bg-red-500 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-md">
                    -{Math.round(((supplement.price - supplement.promoPrice) / supplement.price) * 100)}% REDUCERE
                  </span>
                )}
              {categories.slice(0, 2).map((c) => (
                <span
                  key={c._id || c.name}
                  className="bg-white/90 backdrop-blur text-gray-700 text-[11px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm border border-gray-100"
                >
                  {c.name}
                </span>
              ))}
            </div>
            {inCartItem && (
              <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <FaCheck size={10} />
                In cos ({inCartItem.qty})
              </div>
            )}
            {supplement.image && !imgError ? (
              <img
                src={supplement.image}
                alt={supplement.name}
                className="relative max-h-[360px] w-full object-contain drop-shadow-xl"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="relative text-green-700/70 font-black text-[10rem] leading-none tracking-tight">
                {supplement.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>

          {/* Info side */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col">
            {categories.length > 0 && (
              <div className="text-[11px] uppercase tracking-[0.15em] text-green-700 font-bold mb-2">
                {categories.map((c) => c.name).join(" • ")}
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
              {supplement.name}
            </h1>

            {supplement.description && (
              <p className="text-gray-600 leading-relaxed mb-6">
                {supplement.description}
              </p>
            )}

            {/* Price block */}
            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-gray-100">
              {supplement.promoPrice != null &&
              supplement.price != null &&
              supplement.promoPrice < supplement.price ? (
                <>
                  <span className="text-4xl font-bold text-red-600">
                    {supplement.promoPrice}
                  </span>
                  <span className="text-xl font-semibold text-red-600 mb-1">
                    lei
                  </span>
                  <span className="text-xl text-gray-400 line-through mb-1 ml-2">
                    {supplement.price} lei
                  </span>
                  <span className="text-xs text-gray-400 mb-1.5 ml-1">
                    TVA inclus
                  </span>
                </>
              ) : supplement.price ? (
                <>
                  <span className="text-4xl font-bold text-green-700">
                    {supplement.price}
                  </span>
                  <span className="text-xl font-semibold text-green-700 mb-1">
                    lei
                  </span>
                  <span className="text-xs text-gray-400 mb-1.5 ml-2">
                    TVA inclus
                  </span>
                </>
              ) : (
                <span className="text-gray-400 italic">Pret indisponibil</span>
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 hover:bg-gray-50 text-gray-600 transition-colors"
                  aria-label="Scade cantitatea"
                >
                  <FaMinus size={11} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    setQty(Number.isFinite(n) && n > 0 ? n : 1);
                  }}
                  className="w-12 text-center outline-none font-semibold text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-3 hover:bg-gray-50 text-gray-600 transition-colors"
                  aria-label="Creste cantitatea"
                >
                  <FaPlus size={11} />
                </button>
              </div>
              <button
                onClick={addToCart}
                className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <FaShoppingCart size={14} />
                {inCartItem ? `Mai adauga ${qty}` : "Adauga in cos"}
              </button>
            </div>

            {inCartItem && (
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 text-sm font-semibold mb-6 -mt-2"
              >
                Vezi cosul
                <span aria-hidden>→</span>
              </Link>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-auto pt-6 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-700">
                  <FaShippingFast size={15} />
                </div>
                <span className="text-[11px] text-gray-600 font-medium leading-tight">
                  Livrare rapida
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-700">
                  <FaLeaf size={15} />
                </div>
                <span className="text-[11px] text-gray-600 font-medium leading-tight">
                  100% natural
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-700">
                  <FaShieldAlt size={15} />
                </div>
                <span className="text-[11px] text-gray-600 font-medium leading-tight">
                  Calitate garantata
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-5 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <FaEye size={11} className="text-gray-400" />
                <span className="font-semibold text-gray-700">
                  {supplement.clickCount || 0}
                </span>
                vizualizari
              </span>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <FaHeart size={11} className="text-gray-400" />
                <span className="font-semibold text-gray-700">
                  {supplement.cartCount || 0}
                </span>
                adaugari in cos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info sections */}
      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-700">
              <FaLeaf size={14} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Beneficii</h2>
          </div>
          {benefits.length ? (
            <ul className="space-y-2.5">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-gray-700 text-sm">
                  <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                    <FaCheck size={7} />
                  </span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm italic">Nu exista beneficii listate.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <FaExclamationTriangle size={13} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Efecte secundare</h2>
          </div>
          {sideEffects.length ? (
            <ul className="space-y-2.5">
              {sideEffects.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-gray-700 text-sm">
                  <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold">
                    !
                  </span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm italic">Niciun efect secundar cunoscut.</p>
          )}
        </div>
      </div>

      {diseases.length ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Recomandat pentru
          </h2>
          <div className="flex flex-wrap gap-2">
            {diseases.map((d) => (
              <Link
                key={d._id}
                to={`/diseases/${d._id}`}
                className="bg-green-50 text-green-800 border border-green-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-green-100 hover:border-green-200 transition-colors"
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
