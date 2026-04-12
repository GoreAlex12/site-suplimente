import React from "react";
import {
  FaTruck,
  FaBoxOpen,
  FaClock,
  FaMapMarkerAlt,
  FaCheck,
  FaShippingFast,
} from "react-icons/fa";

const LivrareTransport = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
        Livrare si transport
      </h1>
      <p className="text-gray-500 mb-8">
        Toate informatiile despre livrarea comenzilor tale.
      </p>

      {/* Cost livrare */}
      <section className="grid sm:grid-cols-2 gap-5 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-700 flex items-center justify-center border border-green-100">
              <FaShippingFast size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Livrare gratuita</h3>
              <p className="text-sm text-gray-500">
                Pentru comenzi peste 150 lei
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Toate comenzile cu o valoare de peste 150 lei beneficiaza de livrare
            gratuita pe teritoriul Romaniei, indiferent de greutatea coletului.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <FaTruck size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Cost standard</h3>
              <p className="text-sm text-gray-500">
                Pentru comenzi sub 150 lei
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Costul de livrare este de <strong>25 lei</strong> pentru comenzile cu
            valoare sub 150 lei. Taxa acopera ambalarea si expedierea prin curier.
          </p>
        </div>
      </section>

      {/* Etape livrare */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Cum functioneaza livrarea
        </h2>
        <div className="space-y-4">
          {[
            {
              icon: <FaBoxOpen size={16} />,
              step: "1",
              title: "Plasezi comanda",
              text: "Adaugi produsele in cos si finalizezi comanda online. Primesti imediat un email de confirmare.",
            },
            {
              icon: <FaClock size={16} />,
              step: "2",
              title: "Procesam si amabalam",
              text: "Comanda ta este pregatita si ambalata cu grija in termen de 24 de ore lucratoare.",
            },
            {
              icon: <FaTruck size={16} />,
              step: "3",
              title: "Expediem prin curier",
              text: "Coletul este preluat de curierul partener si livrat in 1-3 zile lucratoare.",
            },
            {
              icon: <FaMapMarkerAlt size={16} />,
              step: "4",
              title: "Primesti coletul",
              text: "Curierul te contacteaza telefonic si livreaza coletul la adresa indicata. Plata se poate face si ramburs.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0 border border-green-100 font-bold text-sm">
                {item.step}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info suplimentare */}
      <section className="bg-gray-50 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Informatii suplimentare
        </h2>
        <ul className="space-y-3">
          {[
            "Livram pe intreg teritoriul Romaniei.",
            "Termenul de livrare este de 1-3 zile lucratoare de la confirmarea comenzii.",
            "Curierul te va contacta telefonic inainte de livrare.",
            "Daca nu esti acasa, curierul va incerca livrarea a doua zi.",
            "Coletele sunt asigurate pe durata transportului.",
            "Verificati integritatea coletului la primire, in fata curierului.",
            "In cazul produselor deteriorate, contactati-ne in 48 de ore.",
          ].map((info, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <FaCheck size={7} />
              </span>
              <span>{info}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default LivrareTransport;
