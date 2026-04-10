import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Message from "../components/Message";

const Cart = () => {
  const { items, totalCount, totalPrice, updateQty, removeItem, clear } = useCart();
  const [checkoutMsg, setCheckoutMsg] = useState("");

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Cosul este gol</h1>
        <p className="text-gray-500 mb-6">
          Nu ai adaugat inca niciun produs in cos.
        </p>
        <Link
          to="/products"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
        >
          Vezi produsele
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    // Demo checkout — we don't actually submit anywhere, so keep the cart
    // intact. The user can clear it manually via "Goleste cosul".
    setCheckoutMsg("Comanda a fost plasata! (demo)");
    setTimeout(() => setCheckoutMsg(""), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Cos de cumparaturi
      </h1>

      {checkoutMsg && <Message type="success">{checkoutMsg}</Message>}

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Items list */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_120px_150px_120px_40px] gap-3 px-5 py-3 bg-gray-50 text-sm font-semibold text-gray-600 border-b">
            <div>Produs</div>
            <div className="text-right">Pret</div>
            <div className="text-center">Cantitate</div>
            <div className="text-right">Subtotal</div>
            <div></div>
          </div>

          <ul className="divide-y">
            {items.map((item) => (
              <li
                key={item._id}
                className="grid md:grid-cols-[1fr_120px_150px_120px_40px] grid-cols-1 gap-3 px-5 py-4 items-center"
              >
                {/* Name */}
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">
                    {item.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <Link
                    to={`/products/${item._id}`}
                    className="font-medium text-gray-800 hover:text-green-700 line-clamp-2"
                  >
                    {item.name}
                  </Link>
                </div>

                {/* Price */}
                <div className="md:text-right text-sm text-gray-700">
                  <span className="md:hidden text-gray-500">Pret: </span>
                  {item.price ? `${item.price} lei` : "—"}
                </div>

                {/* Qty controls */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 font-bold"
                    >
                      −
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
                      className="w-12 text-center outline-none py-1"
                    />
                    <button
                      type="button"
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="md:text-right font-semibold text-gray-800">
                  <span className="md:hidden text-gray-500 font-normal">
                    Subtotal:{" "}
                  </span>
                  {(item.price * item.qty).toFixed(2)} lei
                </div>

                {/* Remove */}
                <div className="md:text-right">
                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="Elimina din cos"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between px-5 py-3 border-t bg-gray-50">
            <Link
              to="/products"
              className="text-green-700 hover:underline text-sm"
            >
              &larr; Continua cumparaturile
            </Link>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Goleste tot cosul?")) clear();
              }}
              className="text-sm text-red-600 hover:underline"
            >
              Goleste cosul
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="bg-white rounded-2xl shadow p-6 h-fit sticky top-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Sumar comanda
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Produse</dt>
              <dd className="text-gray-800 font-medium">{totalCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Subtotal</dt>
              <dd className="text-gray-800 font-medium">
                {totalPrice.toFixed(2)} lei
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Transport</dt>
              <dd className="text-green-700 font-medium">Gratuit</dd>
            </div>
          </dl>
          <div className="border-t my-4"></div>
          <div className="flex justify-between items-baseline mb-5">
            <span className="text-gray-800 font-semibold">Total</span>
            <span className="text-2xl font-bold text-green-700">
              {totalPrice.toFixed(2)} lei
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Finalizeaza comanda
          </button>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Cosul este salvat in browser (localStorage).
          </p>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
