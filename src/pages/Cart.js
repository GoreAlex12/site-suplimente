import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaArrowLeft,
  FaShieldAlt,
  FaTag,
  FaCheck,
  FaTimes,
  FaTruck,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Message from "../components/Message";

const FREE_SHIPPING_THRESHOLD = 150;
const SHIPPING_COST = 25;

// Hardcoded discount codes — { code: { label, type, value } }
const DISCOUNT_CODES = {
  WELCOME20: { label: "20% reducere prima comanda", type: "percent", value: 20 },
  REDUCERE10: { label: "10% reducere", type: "percent", value: 10 },
  MINUS50: { label: "50 lei reducere", type: "fixed", value: 50 },
  LIVRARE: { label: "Livrare gratuita", type: "freeShipping", value: 0 },
};

const Cart = () => {
  const { items, totalCount, totalPrice, updateQty, removeItem, clear } =
    useCart();
  const [checkoutMsg, setCheckoutMsg] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [appliedCode, setAppliedCode] = useState(null);
  const [discountError, setDiscountError] = useState("");

  const applyDiscount = (e) => {
    e.preventDefault();
    setDiscountError("");
    const code = discountInput.trim().toUpperCase();
    if (!code) return;
    const match = DISCOUNT_CODES[code];
    if (!match) {
      setDiscountError("Codul nu este valid.");
      return;
    }
    setAppliedCode({ code, ...match });
    setDiscountInput("");
  };

  const removeDiscount = () => {
    setAppliedCode(null);
    setDiscountError("");
  };

  // Compute final prices
  const { discountAmount, shipping, finalTotal } = useMemo(() => {
    let discount = 0;
    if (appliedCode) {
      if (appliedCode.type === "percent") {
        discount = totalPrice * (appliedCode.value / 100);
      } else if (appliedCode.type === "fixed") {
        discount = Math.min(appliedCode.value, totalPrice);
      }
    }

    const afterDiscount = totalPrice - discount;
    const freeShipping =
      afterDiscount >= FREE_SHIPPING_THRESHOLD ||
      (appliedCode && appliedCode.type === "freeShipping");
    const ship = freeShipping ? 0 : SHIPPING_COST;

    return {
      discountAmount: discount,
      shipping: ship,
      finalTotal: afterDiscount + ship,
    };
  }, [totalPrice, appliedCode]);

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <FaShoppingCart className="text-gray-400" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Cosul tau este gol
        </h1>
        <p className="text-gray-500 mb-8">
          Adauga produse din catalogul nostru pentru a incepe cumparaturile.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <FaArrowLeft size={12} />
          Exploreaza produsele
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    setCheckoutMsg("Comanda a fost plasata! (demo)");
    setTimeout(() => setCheckoutMsg(""), 4000);
  };

  const remainingForFree =
    !appliedCode?.type?.startsWith("freeShipping") &&
    totalPrice - (discountAmount || 0) < FREE_SHIPPING_THRESHOLD
      ? (FREE_SHIPPING_THRESHOLD - (totalPrice - (discountAmount || 0))).toFixed(
          2
        )
      : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Cos de cumparaturi
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          <span className="font-semibold text-green-700">{totalCount}</span>{" "}
          {totalCount === 1 ? "produs" : "produse"} in cos
        </p>
      </div>

      {checkoutMsg && <Message type="success">{checkoutMsg}</Message>}

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Items list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_110px_140px_110px_44px] gap-3 px-5 py-3.5 bg-gray-50/80 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
            <div>Produs</div>
            <div className="text-right">Pret</div>
            <div className="text-center">Cantitate</div>
            <div className="text-right">Subtotal</div>
            <div />
          </div>

          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li
                key={item._id}
                className="grid md:grid-cols-[1fr_110px_140px_110px_44px] grid-cols-1 gap-3 px-5 py-4 items-center hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0 border border-green-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-contain rounded-xl p-1"
                      />
                    ) : (
                      item.name?.[0]?.toUpperCase() || "?"
                    )}
                  </div>
                  <Link
                    to={`/products/${item._id}`}
                    className="font-medium text-gray-800 hover:text-green-700 line-clamp-2 transition-colors"
                  >
                    {item.name}
                  </Link>
                </div>

                <div className="md:text-right text-sm text-gray-600">
                  <span className="md:hidden text-gray-400 text-xs">Pret: </span>
                  {item.price ? `${item.price} lei` : "—"}
                </div>

                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      className="px-3 py-2 hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                      <FaMinus size={10} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => {
                        const n = parseInt(e.target.value, 10);
                        updateQty(
                          item._id,
                          Number.isFinite(n) && n > 0 ? n : 1
                        );
                      }}
                      className="w-10 text-center outline-none py-1.5 font-semibold text-gray-800 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      className="px-3 py-2 hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>

                <div className="md:text-right font-semibold text-gray-900 text-sm">
                  <span className="md:hidden text-gray-400 font-normal text-xs">
                    Subtotal:{" "}
                  </span>
                  {(item.price * item.qty).toFixed(2)} lei
                </div>

                <div className="md:text-right">
                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all"
                    title="Elimina din cos"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/50">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 text-sm font-medium transition-colors"
            >
              <FaArrowLeft size={11} />
              Continua cumparaturile
            </Link>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Goleste tot cosul?")) clear();
              }}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Goleste cosul
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">
            Sumar comanda
          </h2>

          {/* Discount code input */}
          <div className="mb-5">
            {appliedCode ? (
              <div className="flex items-center justify-between gap-2 bg-green-50 border border-green-200 rounded-xl px-3.5 py-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <FaTag size={12} className="text-green-600" />
                  <div>
                    <span className="font-bold text-green-800">
                      {appliedCode.code}
                    </span>
                    <span className="text-green-700 ml-1.5 text-xs">
                      — {appliedCode.label}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeDiscount}
                  className="text-green-600 hover:text-red-500 transition-colors p-1"
                  title="Elimina codul"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <form onSubmit={applyDiscount}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Cod de reducere
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={(e) => {
                      setDiscountInput(e.target.value);
                      setDiscountError("");
                    }}
                    placeholder="ex: WELCOME20"
                    className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 rounded-xl transition"
                  >
                    Aplica
                  </button>
                </div>
                {discountError && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">
                    {discountError}
                  </p>
                )}
              </form>
            )}
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Produse</dt>
              <dd className="text-gray-800 font-semibold">{totalCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="text-gray-800 font-semibold">
                {totalPrice.toFixed(2)} lei
              </dd>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between">
                <dt className="text-green-700 flex items-center gap-1.5">
                  <FaTag size={10} />
                  Reducere
                </dt>
                <dd className="text-green-700 font-semibold">
                  -{discountAmount.toFixed(2)} lei
                </dd>
              </div>
            )}

            <div className="flex justify-between">
              <dt className="text-gray-500 flex items-center gap-1.5">
                <FaTruck size={11} />
                Transport
              </dt>
              {shipping === 0 ? (
                <dd className="text-green-700 font-semibold flex items-center gap-1">
                  <FaCheck size={9} />
                  Gratuit
                </dd>
              ) : (
                <dd className="text-gray-800 font-semibold">
                  {shipping.toFixed(2)} lei
                </dd>
              )}
            </div>
          </dl>

          {remainingForFree && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3 font-medium">
              Mai adauga {remainingForFree} lei pentru livrare gratuita!
            </p>
          )}

          <div className="border-t border-gray-100 my-5" />

          <div className="flex justify-between items-baseline mb-6">
            <span className="text-gray-900 font-bold">Total</span>
            <span className="text-2xl font-bold text-green-700">
              {finalTotal.toFixed(2)} lei
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Finalizeaza comanda
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            <FaShieldAlt size={11} />
            <span>Plata securizata</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
