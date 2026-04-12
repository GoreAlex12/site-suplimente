import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaHeartbeat } from "react-icons/fa";
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
  if (error)
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Message type="error">{error}</Message>
      </div>
    );
  if (!data) return null;

  const { disease, supplements } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
        <Link
          to="/diseases"
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-colors"
        >
          <FaArrowLeft size={12} />
          Inapoi la afectiuni
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600 truncate">{disease.name}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0 border border-green-100">
            <FaHeartbeat size={18} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {disease.name}
            </h1>
          </div>
        </div>

        {disease.description && (
          <p className="text-gray-600 leading-relaxed mb-5 max-w-3xl">
            {disease.description}
          </p>
        )}

        {disease.symptoms?.length ? (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Simptome
            </h3>
            <div className="flex flex-wrap gap-2">
              {disease.symptoms.map((s, i) => (
                <span
                  key={i}
                  className="bg-green-50 text-green-700 text-sm font-medium px-3.5 py-1.5 rounded-full border border-green-100"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Suplimente recomandate
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            <span className="font-semibold text-green-700">
              {supplements.length}
            </span>{" "}
            {supplements.length === 1 ? "produs recomandat" : "produse recomandate"}
          </p>
        </div>
      </div>

      {supplements.length === 0 ? (
        <Message type="info">
          Nu exista suplimente asociate acestei afectiuni.
        </Message>
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
