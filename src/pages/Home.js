import React, { useEffect, useState } from "react";
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
      .popular(8)
      .then(setPopular)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <section className="mb-12 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl p-10 shadow-lg">
        <h1 className="text-4xl font-bold mb-3">Sanatate din natura</h1>
        <p className="text-lg opacity-90 max-w-2xl">
          Gaseste cele mai bune suplimente pentru afectiunile tale. Cauta dupa
          nume, afectiune sau simptom.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Cele mai populare suplimente
        </h2>
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
