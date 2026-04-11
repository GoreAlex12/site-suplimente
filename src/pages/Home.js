import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShippingFast,
  FaLeaf,
  FaShieldAlt,
  FaPercent,
  FaGift,
  FaHeartbeat,
  FaArrowRight,
} from "react-icons/fa";
import { supplementApi } from "../services/api";
import SupplementCard from "../components/SupplementCard";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Home = () => {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    supplementApi
      .popular(20)
      .then(setPopular)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Hero */}
      <section className="relative mb-8 sm:mb-10 bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 text-white rounded-2xl p-6 sm:p-10 shadow-lg overflow-hidden">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-2xl pointer-events-none"></div>
        <div className="relative">
          <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-3">
            SANATATE NATURALA
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
            Sanatate din natura
          </h1>
          <p className="text-base sm:text-lg opacity-95 max-w-2xl mb-5">
            Gaseste cele mai bune suplimente pentru afectiunile tale. Cauta dupa
            nume, afectiune sau simptom.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 font-semibold px-5 py-2.5 rounded-lg shadow transition"
            >
              Vezi produsele <FaArrowRight size={12} />
            </Link>
            <Link
              to="/diseases"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur text-white font-semibold px-5 py-2.5 rounded-lg border border-white/30 transition"
            >
              Exploreaza afectiunile
            </Link>
          </div>
        </div>
      </section>

      {/* Promo / offers strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <Link
          to="/products"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 shadow hover:shadow-xl transition"
        >
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/15"></div>
          <FaPercent className="text-3xl mb-3 opacity-90" />
          <div className="text-xs font-semibold tracking-wider opacity-90 mb-1">
            REDUCERE
          </div>
          <h3 className="text-2xl font-bold mb-1">-20% la prima comanda</h3>
          <p className="text-sm opacity-90 mb-3">
            Foloseste codul WELCOME20 la finalizare.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
            Profita acum <FaArrowRight size={11} />
          </span>
        </Link>

        <Link
          to="/products?group=suplimente"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-teal-500 text-white p-6 shadow hover:shadow-xl transition"
        >
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/15"></div>
          <FaGift className="text-3xl mb-3 opacity-90" />
          <div className="text-xs font-semibold tracking-wider opacity-90 mb-1">
            OFERTA SPECIALA
          </div>
          <h3 className="text-2xl font-bold mb-1">2+1 GRATIS la vitamine</h3>
          <p className="text-sm opacity-90 mb-3">
            La selectia de vitamine si minerale.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
            Vezi selectia <FaArrowRight size={11} />
          </span>
        </Link>

        <Link
          to="/diseases"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-500 text-white p-6 shadow hover:shadow-xl transition sm:col-span-2 lg:col-span-1"
        >
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/15"></div>
          <FaHeartbeat className="text-3xl mb-3 opacity-90" />
          <div className="text-xs font-semibold tracking-wider opacity-90 mb-1">
            GHID
          </div>
          <h3 className="text-2xl font-bold mb-1">Suplimente pe afectiuni</h3>
          <p className="text-sm opacity-90 mb-3">
            Descopera ce te poate ajuta in functie de simptome.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
            Exploreaza <FaArrowRight size={11} />
          </span>
        </Link>
      </section>

      {/* Trust / benefits strip */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
            <FaShippingFast />
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-sm sm:text-base">
              Livrare rapida
            </div>
            <div className="text-xs text-gray-500">Gratuita peste 150 lei</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
            <FaLeaf />
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-sm sm:text-base">
              100% natural
            </div>
            <div className="text-xs text-gray-500">Ingrediente verificate</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
            <FaShieldAlt />
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-sm sm:text-base">
              Plata sigura
            </div>
            <div className="text-xs text-gray-500">Tranzactii criptate</div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Top 20 cele mai populare suplimente
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Cele mai cumparate produse de clientii nostri
            </p>
          </div>
          <Link
            to="/products"
            className="text-green-700 hover:text-green-800 font-semibold text-sm inline-flex items-center gap-1"
          >
            Vezi toate <FaArrowRight size={11} />
          </Link>
        </div>
        {loading && <Loader />}
        {error && <Message type="error">{error}</Message>}
        {!loading && !error && popular.length === 0 && (
          <Message type="info">
            Nu exista inca suplimente. Ruleaza scriptul de seed in backend.
          </Message>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {popular.map((s) => (
            <SupplementCard key={s._id} supplement={s} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
