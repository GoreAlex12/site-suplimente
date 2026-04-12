import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const brands = [
  // — Autohtone —
  {
    name: "Dacia Plant",
    logo: "https://daciaplant.ro/media/codazon/logo/14/default/logo.png",
    description:
      "Producator roman de suplimente din plante medicinale, fondat in 2002 in Brasov. Experienta de peste 20 de ani in domeniul fitoterapiei.",
    country: "Romania",
    website: "https://daciaplant.ro",
  },
  {
    name: "Alevia",
    logo: "https://alevia.ro/wp-content/themes/alevia2025/img/alevia-logo.jpg",
    description:
      "Brand romanesc din Falticeni cu traditie in dezvoltarea si comercializarea suplimentelor alimentare si produselor naturiste.",
    country: "Romania",
    website: "https://alevia.ro",
  },
  {
    name: "Herbagetica",
    logo: "https://herbagetica.ro/media/codazon/logo/14/default/logo.svg",
    description:
      "Lider roman in suplimente 100% naturale, fondat in 2010 in Brasov. Peste 15 ani de expertiza in fitoterapie moderna.",
    country: "Romania",
    website: "https://herbagetica.ro",
  },
  {
    name: "Fares",
    logo: "https://fares.ro/img/logo-1768663360.jpg",
    description:
      "Producator roman cu traditie din 1929, specializat in ceaiuri medicinale si suplimente naturale. Sediul in Orastie, Hunedoara.",
    country: "Romania",
    website: "https://fares.ro",
  },
  {
    name: "Zenyth",
    logo: "https://zenyth.com/wp-content/uploads/2025/06/logozen-facelift-green.png",
    description:
      "Companie farmaceutica romaneasca producatoare de suplimente alimentare premium, recunoscuta pentru calitatea ingredientelor.",
    country: "Romania",
    website: "https://zenyth.com",
  },
  {
    name: "SANOVITA",
    logo: "https://sanovita.ro/img/logo-1749716399.jpg",
    description:
      "Producator roman din judetul Valcea, cu peste 30 de ani de experienta in alimente pe baza de plante si suplimente alimentare.",
    country: "Romania",
    website: "https://sanovita.ro",
  },
  {
    name: "Hofigal",
    logo: "https://hofigal.eu/img/logo-1744092211.jpg",
    description:
      "Producator roman de produse fitoterapeutice din 1990, cu un portofoliu de peste 450 de produse. Specializat in uleiul de catina.",
    country: "Romania",
    website: "https://hofigal.eu",
  },
  // — Internationale —
  {
    name: "Swanson",
    logo: "https://images.seeklogo.com/logo-png/53/2/swanson-logo-png_seeklogo-535228.png",
    description:
      "Brand american de suplimente alimentare si vitamine, cunoscut pentru gama larga de produse naturale la preturi accesibile.",
    country: "SUA",
    website: "https://www.swansonvitamins.com",
  },
  {
    name: "Nature's Way",
    logo: "https://images.seeklogo.com/logo-png/9/1/natures-way-logo-png_seeklogo-97526.png",
    description:
      "Brand american cu peste 50 de ani de experienta in suplimente pe baza de plante. Certificat TRU-ID pentru autenticitatea ingredientelor.",
    country: "SUA",
    website: "https://naturesway.com",
  },
  {
    name: "Solgar",
    logo: "https://images.seeklogo.com/logo-png/30/1/solgar-logo-png_seeklogo-307865.png",
    description:
      "Brand international premium cu peste 75 de ani de istorie. Suplimente de calitate superioara, fara gluten si fara conservanti artificiali.",
    country: "SUA",
    website: "https://www.solgar.com",
  },
  {
    name: "Solaray",
    logo: "https://solaray.com/cdn/shop/files/solaray-logo-2023.png",
    description:
      "Brand american recunoscut pentru logo-ul cu curcubeu si angajamentul fata de produsele naturale de calitate superioara.",
    country: "SUA",
    website: "https://solaray.com",
  },
  {
    name: "Now Foods",
    logo: "https://www.pngkit.com/png/detail/269-2699482_now-foods-logo-adam-now-food-softgels.png",
    description:
      "Unul dintre cei mai mari producatori de suplimente din lume, cu peste 1.400 de produse naturale la preturi accesibile.",
    country: "SUA",
    website: "https://www.nowfoods.com",
  },
];

const romanesti = brands.filter((b) => b.country === "Romania");
const internationale = brands.filter((b) => b.country !== "Romania");

const BrandCard = ({ brand }) => (
  <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
    {/* Logo area */}
    <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 border-b border-gray-100">
      <img
        src={brand.logo}
        alt={brand.name}
        className="max-h-full max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.parentElement.innerHTML = `<span class="text-3xl font-extrabold text-gray-400 tracking-tight">${brand.name}</span>`;
        }}
      />
    </div>

    {/* Info */}
    <div className="p-5 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-900 text-lg">{brand.name}</h3>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {brand.country}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-3">
        {brand.description}
      </p>
      <a
        href={brand.website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 text-sm font-semibold mt-4 transition-colors"
      >
        Viziteaza site-ul <FaExternalLinkAlt size={10} />
      </a>
    </div>
  </div>
);

const Producatori = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Producatori si branduri
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Colaboram doar cu producatori de incredere, recunoscuti pentru calitatea
          ingredientelor si standardele inalte de productie.
        </p>
      </div>

      {/* Branduri romanesti */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">
          Branduri autohtone
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {romanesti.map((brand) => (
            <BrandCard key={brand.name} brand={brand} />
          ))}
        </div>
      </section>

      {/* Branduri internationale */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">
          Branduri internationale
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {internationale.map((brand) => (
            <BrandCard key={brand.name} brand={brand} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Producatori;
