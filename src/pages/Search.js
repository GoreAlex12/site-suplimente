import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supplementApi } from "../services/api";
import SupplementCard from "../components/SupplementCard";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Search = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState({ supplements: [], diseases: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!q) {
      setResults({ supplements: [], diseases: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    supplementApi
      .search(q)
      .then(setResults)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Rezultate pentru "{q}"
      </h1>
      <p className="text-gray-500 mb-6">
        {results.supplements.length} suplimente · {results.diseases.length} afectiuni
      </p>

      {loading && <Loader />}
      {error && <Message type="error">{error}</Message>}

      {!loading && results.diseases.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Afectiuni</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.diseases.map((d) => (
              <Link
                key={d._id}
                to={`/diseases/${d._id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 border border-gray-100"
              >
                <h3 className="font-semibold text-gray-800">{d.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {d.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!loading && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Suplimente</h2>
          {results.supplements.length === 0 ? (
            <Message type="info">Niciun supliment gasit.</Message>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {results.supplements.map((s) => (
                <SupplementCard key={s._id} supplement={s} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Search;
