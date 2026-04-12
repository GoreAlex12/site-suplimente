import React from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaUsers,
  FaHeart,
  FaShieldAlt,
  FaMedkit,
  FaHandshake,
} from "react-icons/fa";

const values = [
  {
    icon: <FaLeaf size={20} />,
    title: "Naturalete",
    text: "Selectam doar produse cu ingrediente naturale, fara aditivi sintetici nocivi.",
  },
  {
    icon: <FaShieldAlt size={20} />,
    title: "Calitate",
    text: "Fiecare produs trece prin verificari riguroase inainte de a ajunge la tine.",
  },
  {
    icon: <FaHeart size={20} />,
    title: "Grija",
    text: "Sanatatea ta este prioritatea noastra. Oferim consultanta personalizata.",
  },
  {
    icon: <FaHandshake size={20} />,
    title: "Incredere",
    text: "Colaboram doar cu producatori de renume, cu certificari internationale.",
  },
];

const DespreNoi = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-16 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.15em] mb-5">
            <FaMedkit size={11} />
            DESPRE NOI
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
            Povestea noastra
          </h1>
          <p className="text-base sm:text-lg opacity-95 leading-relaxed">
            Suntem o echipa pasionata de sanatate naturala, dedicata sa aducem
            cele mai bune suplimente alimentare la indemana tuturor romanilor.
          </p>
        </div>
      </section>

      {/* Cine suntem */}
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Cine suntem
        </h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
          <p>
            Am pornit aceasta afacere din dorinta de a oferi oamenilor acces la
            suplimente alimentare de calitate superioara, la preturi corecte.
            Cu o experienta de peste 10 ani in domeniul sanatatii si al
            nutritiei, ne-am propus sa cream un magazin online in care fiecare
            produs este verificat, testat si recomandat de specialisti.
          </p>
          <p>
            Colaboram cu cei mai importanti producatori din Romania si din
            Europa, selectand doar branduri care respecta cele mai inalte
            standarde de calitate. De la vitamine si minerale, pana la
            suplimente naturiste si produse apicole, gama noastra acopera
            toate nevoile tale de sanatate.
          </p>
          <p>
            Credem ca sanatatea este cel mai pretios bun pe care il avem, iar
            accesul la produse naturale de calitate nu ar trebui sa fie un
            privilegiu, ci un drept al fiecaruia.
          </p>
        </div>
      </section>

      {/* Valorile noastre */}
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Valorile noastre
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0 border border-green-100">
                {v.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Echipa */}
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Echipa noastra
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0 border border-green-100">
              <FaUsers size={20} />
            </div>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>
                Echipa noastra este formata din farmacisti, nutritionisti si
                specialisti in sanatate care selecteaza si verifica fiecare
                produs din catalog. Suntem mereu la dispozitia ta pentru
                recomandari si intrebari.
              </p>
              <p>
                Ne poti contacta telefonic la{" "}
                <a
                  href="tel:+40772027622"
                  className="font-semibold text-green-700 hover:underline"
                >
                  0772 027 622
                </a>{" "}
                sau prin pagina de{" "}
                <Link
                  to="/contact"
                  className="font-semibold text-green-700 hover:underline"
                >
                  Contact
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gray-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Hai sa ne cunoastem mai bine!
        </h2>
        <p className="text-gray-500 mb-5 max-w-md mx-auto">
          Exploreaza catalogul nostru sau contacteaza-ne pentru recomandari
          personalizate.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
          >
            Vezi produsele
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-green-400 font-semibold px-6 py-3 rounded-xl shadow-sm transition"
          >
            Contacteaza-ne
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DespreNoi;
