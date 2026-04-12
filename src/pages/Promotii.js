import React, { useEffect, useState } from "react";
import { FaTag } from "react-icons/fa";
import { supplementApi } from "../services/api";
import SupplementCard from "../components/SupplementCard";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Promotii = () => {
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    supplementApi
      .list()
      .then((data) => {
        // Keep only supplements that have a promoPrice lower than their price
        const promos = data.filter(
          (s) =>
            s.promoPrice != null &&
            s.price != null &&
            s.promoPrice < s.price
        );
        setSupplements(promos);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <section className="relative mb-8 bg-gradient-to-br from-red-500 via-red-500 to-orange-500 text-white rounded-3xl p-6 sm:p-10 shadow-lg overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-16 h-56 w-56 rounded-full bg-orange-300/20 blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0 border border-white/25">
            <FaTag size={22} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Promotii active
            </h1>
            <p className="text-base opacity-90 mt-1">
              Profita de reducerile noastre la suplimentele selectate.
            </p>
          </div>
        </div>
      </section>

      {loading && <Loader />}
      {error && <Message type="error">{error}</Message>}

      {!loading && !error && supplements.length === 0 && (
        <Message type="info">
          Nu exista promotii active in acest moment. Revino curand!
        </Message>
      )}

      {!loading && supplements.length > 0 && (
        <>
          <p className="text-gray-500 mb-6 text-sm">
            <span className="font-semibold text-red-600">
              {supplements.length}
            </span>{" "}
            {supplements.length === 1
              ? "produs la promotie"
              : "produse la promotie"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {supplements.map((s) => (
              <SupplementCard key={s._id} supplement={s} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Promotii;
