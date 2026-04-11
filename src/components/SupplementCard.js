import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaShoppingCart, FaPlus } from "react-icons/fa";
import { supplementApi } from "../services/api";
import { useCart } from "../context/CartContext";

const SupplementCard = ({ supplement }) => {
  const navigate = useNavigate();
  const { addItem, getItem } = useCart();
  const [imgError, setImgError] = useState(false);

  const inCartItem = getItem(supplement._id);
  const hasImage = supplement.image && !imgError;
  const categoryLabel = (supplement.categories || [])[0]?.name;

  const handleOpen = () => {
    // Track click for popularity ranking (fire-and-forget)
    supplementApi.trackClick(supplement._id).catch(() => {});
    navigate(`/products/${supplement._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(supplement, 1);
    supplementApi.trackCart(supplement._id).catch(() => {});
  };

  return (
    <div
      onClick={handleOpen}
      className="group relative cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-green-200 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-2 pointer-events-none">
        {categoryLabel ? (
          <span className="bg-white/90 backdrop-blur text-gray-700 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm border border-gray-100 truncate max-w-[60%]">
            {categoryLabel}
          </span>
        ) : (
          <span />
        )}
        {inCartItem && (
          <span className="bg-green-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <FaCheck size={9} />
            {inCartItem.qty}
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.8),transparent_60%)]" />
        {hasImage ? (
          <img
            src={supplement.image}
            alt={supplement.name}
            className="relative h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="relative text-green-700/70 font-black text-6xl tracking-tight">
            {supplement.name?.[0]?.toUpperCase() || "?"}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug mb-1 line-clamp-2 min-h-[2.6rem] group-hover:text-green-700 transition-colors">
          {supplement.name}
        </h3>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-1">
          {supplement.description || "Fara descriere"}
        </p>

        <div className="flex items-end justify-between gap-2 mt-auto pt-3 border-t border-gray-100">
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              Pret
            </span>
            <span className="text-green-700 font-bold text-lg">
              {supplement.price ? `${supplement.price} lei` : "—"}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            aria-label="Adauga in cos"
            className={`flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg transition-all shadow-sm ${
              inCartItem
                ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                : "bg-green-600 hover:bg-green-700 text-white hover:shadow-md"
            }`}
          >
            {inCartItem ? (
              <>
                <FaPlus size={10} />
                <span>Mai adauga</span>
              </>
            ) : (
              <>
                <FaShoppingCart size={11} />
                <span>Adauga</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplementCard;
