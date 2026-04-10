import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { diseaseApi } from "../services/api";
import SupplementCard from "../components/SupplementCard";
import Loader from "../components/Loader";
import Message from "../components/Message";

const DiseaseDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    diseaseApi
      .get(id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="max-w-5xl mx-auto p-6"><Message type="error">{error}</Message></div>;
  if (!data) return null;

  const { disease, supplements } = data;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link to="/diseases" className="text-green-700 hover:underline inline-block mb-4">
        &larr; Inapoi la afectiuni
      </Link>

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{disease.name}</h1>
        <p className="text-gray-700 mb-4">{disease.description}</p>

        {disease.symptoms?.length ? (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Simptome</h3>
            <div className="flex flex-wrap gap-2">
              {disease.symptoms.map((s, i) => (
                <span
                  key={i}
                  className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Suplimente recomandate
      </h2>

      {supplements.length === 0 ? (
        <Message type="info">Nu exista suplimente asociate acestei afectiuni.</Message>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {supplements.map((s) => (
            <SupplementCard key={s._id} supplement={s} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiseaseDetails;
