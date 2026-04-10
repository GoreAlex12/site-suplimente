import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { supplementApi } from "../services/api";
import { useCart } from "../context/CartContext";

const SupplementCard = ({ supplement }) => {
  const navigate = useNavigate();
  const { addItem, getItem } = useCart();
  const [imgError, setImgError] = useState(false);

  const inCartItem = getItem(supplement._id);
  const hasImage = supplement.image && !imgError;

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
      className="relative cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col border border-gray-100"
    >
      {inCartItem && (
        <div className="absolute top-3 right-3 z-10 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow">
          <FaCheck size={10} />
          In cos ({inCartItem.qty})
        </div>
      )}

      <div className="h-40 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
        {hasImage ? (
          <img
            src={supplement.image}
            alt={supplement.name}
            className="h-full w-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-green-700 font-bold text-3xl">
            {supplement.name?.[0]?.toUpperCase() || "?"}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
        {supplement.name}
      </h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">
        {supplement.description || "Fara descriere"}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-green-700 font-bold text-lg">
          {supplement.price ? `${supplement.price} lei` : "—"}
        </span>
        <button
          onClick={handleAddToCart}
          className={`text-sm font-semibold py-1.5 px-3 rounded-lg transition ${
            inCartItem
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {inCartItem ? "+1" : "Adauga in cos"}
        </button>
      </div>
    </div>
  );
};

export default SupplementCard;
