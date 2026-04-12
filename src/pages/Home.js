import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShippingFast,
  FaLeaf,
  FaPercent,
  FaGift,
  FaHeartbeat,
  FaArrowRight,
  FaTag,
} from "react-icons/fa";
import { supplementApi } from "../services/api";
import SupplementCard from "../components/SupplementCard";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Home = () => {
  const [popular, setPopular] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      supplementApi.popular(20),
      supplementApi.promo(),
    ])
      .then(([pop, promo]) => {
        setPopular(pop);
        setPromos(promo);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Hero */}
      <section className="relative mb-8 sm:mb-10 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white rounded-3xl shadow-xl overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-24 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_55%)] pointer-events-none" />

        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-10 items-center p-6 sm:p-10 lg:p-12">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.15em] mb-5">
              <FaLeaf size={11} />
              SANATATE NATURALA • CALITATE PREMIUM
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-[1.05] tracking-tight">
              Energie, echilibru <br className="hidden sm:block" />
              si{" "}
              <span className="relative inline-block">
                <span className="relative z-10">vitalitate</span>
                <span className="absolute left-0 right-0 bottom-1 h-3 bg-emerald-300/40 rounded-full -z-0" />
              </span>{" "}
              in fiecare zi
            </h1>

            <p className="text-base sm:text-lg opacity-95 max-w-xl mb-7 leading-relaxed">
              Suplimente selectate cu grija, din ingrediente pure, pentru
              sanatatea ta si a familiei tale. Produse recomandate de
              specialisti, testate si verificate.
            </p>

            <div className="flex flex-wrap gap-3 mb-7">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Cumpara acum <FaArrowRight size={12} />
              </Link>
              <Link
                to="/diseases"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-6 py-3 rounded-xl border border-white/30 transition"
              >
                Exploreaza afectiunile
              </Link>
            </div>

            {/* Trust badges */}
            <div className="pt-6 border-t border-white/20 flex flex-wrap gap-x-8 gap-y-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center flex-shrink-0">
                  <FaShippingFast className="text-white" size={16} />
                </div>
                <div className="leading-tight">
                  <div className="font-semibold text-sm sm:text-base">
                    Livrare rapida
                  </div>
                  <div className="text-xs opacity-80">Gratuita peste 150 lei</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center flex-shrink-0">
                  <FaLeaf className="text-white" size={16} />
                </div>
                <div className="leading-tight">
                  <div className="font-semibold text-sm sm:text-base">
                    100% natural
                  </div>
                  <div className="text-xs opacity-80">Ingrediente verificate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual highlight card */}
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 rotate-3" />
            <div className="relative bg-white/15 backdrop-blur-md rounded-2xl border border-white/30 p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest uppercase opacity-90">
                  Oferta limitata
                </span>
              </div>
              <div className="text-5xl font-extrabold mb-1 leading-none">
                -20<span className="text-3xl align-top">%</span>
              </div>
              <div className="text-lg font-semibold mb-1">la prima comanda</div>
              <p className="text-sm opacity-85 mb-5">
                Foloseste codul{" "}
                <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                  WELCOME20
                </span>{" "}
                la finalizare.
              </p>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span className="opacity-90">Peste 500 de produse</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span className="opacity-90">Garantie de calitate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span className="opacity-90">Consultanta gratuita</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo / offers strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        <Link
          to="/products"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-lg" />
          <div className="absolute -left-4 -bottom-8 h-24 w-24 rounded-full bg-white/10 blur-lg" />
          <div className="relative">
            <FaPercent className="text-2xl mb-3 opacity-90" />
            <div className="text-[11px] font-bold tracking-widest opacity-80 mb-1">
              REDUCERE
            </div>
            <h3 className="text-xl font-bold mb-1 leading-snug">
              -20% la prima comanda
            </h3>
            <p className="text-sm opacity-85 mb-4">
              Foloseste codul WELCOME20 la finalizare.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
              Profita acum <FaArrowRight size={11} />
            </span>
          </div>
        </Link>

        <Link
          to="/products?group=suplimente"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-teal-500 text-white p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-lg" />
          <div className="absolute -left-4 -bottom-8 h-24 w-24 rounded-full bg-white/10 blur-lg" />
          <div className="relative">
            <FaGift className="text-2xl mb-3 opacity-90" />
            <div className="text-[11px] font-bold tracking-widest opacity-80 mb-1">
              OFERTA SPECIALA
            </div>
            <h3 className="text-xl font-bold mb-1 leading-snug">
              2+1 GRATIS la vitamine
            </h3>
            <p className="text-sm opacity-85 mb-4">
              La selectia de vitamine si minerale.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
              Vezi selectia <FaArrowRight size={11} />
            </span>
          </div>
        </Link>

        <Link
          to="/diseases"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-500 text-white p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all sm:col-span-2 lg:col-span-1"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-lg" />
          <div className="absolute -left-4 -bottom-8 h-24 w-24 rounded-full bg-white/10 blur-lg" />
          <div className="relative">
            <FaHeartbeat className="text-2xl mb-3 opacity-90" />
            <div className="text-[11px] font-bold tracking-widest opacity-80 mb-1">
              GHID
            </div>
            <h3 className="text-xl font-bold mb-1 leading-snug">
              Suplimente pe afectiuni
            </h3>
            <p className="text-sm opacity-85 mb-4">
              Descopera ce te poate ajuta in functie de simptome.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
              Exploreaza <FaArrowRight size={11} />
            </span>
          </div>
        </Link>
      </section>

      {/* Promo products — only shown if any exist */}
      {!loading && promos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
                <FaTag size={16} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Reduceri active
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  <span className="font-semibold text-red-600">{promos.length}</span>{" "}
                  {promos.length === 1 ? "produs" : "produse"} la pret redus
                </p>
              </div>
            </div>
            <Link
              to="/promotii"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm transition-colors"
            >
              Vezi toate ofertele <FaArrowRight size={11} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {promos.slice(0, 8).map((s) => (
              <SupplementCard key={s._id} supplement={s} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Cele mai populare produse
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Alese de clientii nostri
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold text-sm transition-colors"
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
