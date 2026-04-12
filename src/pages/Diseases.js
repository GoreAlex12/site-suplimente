import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaHeartbeat, FaSearch } from "react-icons/fa";
import { diseaseApi } from "../services/api";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Diseases = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const symptomFilter = searchParams.get("symptom") || "";
  const [query, setQuery] = useState(symptomFilter);

  useEffect(() => {
    diseaseApi
      .list()
      .then(setDiseases)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = diseases.filter((d) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.description || "").toLowerCase().includes(q) ||
      (d.symptoms || []).some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Afectiuni
        </h1>
        <p className="text-gray-500 max-w-lg">
          Exploreaza afectiunile si descopera suplimentele recomandate pentru
          fiecare.
        </p>
      </div>

      <div className="relative mb-8 max-w-xl">
        <FaSearch
          size={14}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Filtreaza dupa nume sau simptom..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition placeholder:text-gray-400"
        />
      </div>

      {loading && <Loader />}
      {error && <Message type="error">{error}</Message>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((d) => (
          <Link
            to={`/diseases/${d._id}`}
            key={d._id}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 hover:-translate-y-0.5 transition-all p-5"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0 border border-green-100 group-hover:bg-green-100 transition-colors">
                <FaHeartbeat size={14} />
              </div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors leading-snug">
                {d.name}
              </h2>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {d.description || "Fara descriere"}
            </p>
            {d.symptoms?.length ? (
              <div className="flex flex-wrap gap-1.5">
                {d.symptoms.slice(0, 4).map((s, i) => (
                  <span
                    key={i}
                    className="bg-green-50 text-green-700 text-[11px] font-medium px-2.5 py-1 rounded-full border border-green-100"
                  >
                    {s}
                  </span>
                ))}
                {d.symptoms.length > 4 && (
                  <span className="text-[11px] text-gray-400 font-medium px-2 py-1">
                    +{d.symptoms.length - 4}
                  </span>
                )}
              </div>
            ) : null}
          </Link>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <Message type="info">Nicio afectiune gasita.</Message>
      )}
    </div>
  );
};

export default Diseases;
