import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryApi, supplementApi, diseaseApi } from "../../services/api";
import Loader from "../../components/Loader";

const Stat = ({ label, value, to, color }) => (
  <Link
    to={to}
    className={`block rounded-xl p-6 shadow hover:shadow-lg transition ${color}`}
  >
    <div className="text-3xl font-bold text-white">{value}</div>
    <div className="text-sm text-white/90 mt-1">{label}</div>
  </Link>
);

const AdminDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [topSupplements, setTopSupplements] = useState([]);

  useEffect(() => {
    Promise.all([
      categoryApi.list(),
      supplementApi.list(),
      diseaseApi.list(),
      supplementApi.popular(5),
    ])
      .then(([cats, sups, dis, popular]) => {
        setCounts({
          categories: cats.length,
          supplements: sups.length,
          diseases: dis.length,
        });
        setTopSupplements(popular);
      })
      .catch(() => setCounts({ categories: 0, supplements: 0, diseases: 0 }));
  }, []);

  if (!counts) return <Loader />;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Privire generala</h2>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Stat label="Categorii" value={counts.categories} to="/admin/categories" color="bg-green-600" />
        <Stat label="Suplimente" value={counts.supplements} to="/admin/supplements" color="bg-emerald-600" />
        <Stat label="Afectiuni" value={counts.diseases} to="/admin/diseases" color="bg-teal-600" />
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        Top suplimente populare
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-3">Nume</th>
              <th className="p-3">Click-uri</th>
              <th className="p-3">In cos</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {topSupplements.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-3 font-medium text-gray-800">{s.name}</td>
                <td className="p-3">{s.clickCount || 0}</td>
                <td className="p-3">{s.cartCount || 0}</td>
                <td className="p-3">
                  <Link
                    to={`/products/${s._id}`}
                    state={{ from: "/admin" }}
                    className="text-green-700 hover:underline text-sm"
                  >
                    Vezi →
                  </Link>
                </td>
              </tr>
            ))}
            {topSupplements.length === 0 && (
              <tr>
                <td colSpan="4" className="p-3 text-gray-400 text-center">
                  Niciun supliment inregistrat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
