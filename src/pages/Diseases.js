import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Afectiuni</h1>
      <p className="text-gray-500 mb-6">
        Exploreaza afectiunile si descopera suplimentele recomandate pentru fiecare.
      </p>

      <input
        type="text"
        placeholder="Filtreaza dupa nume sau simptom..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full mb-6 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {loading && <Loader />}
      {error && <Message type="error">{error}</Message>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((d) => (
          <Link
            to={`/diseases/${d._id}`}
            key={d._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{d.name}</h2>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {d.description || "Fara descriere"}
            </p>
            {d.symptoms?.length ? (
              <div className="flex flex-wrap gap-1">
                {d.symptoms.slice(0, 4).map((s, i) => (
                  <span
                    key={i}
                    className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full"
                  >
                    {s}
                  </span>
                ))}
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
