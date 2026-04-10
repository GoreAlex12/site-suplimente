import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg font-medium transition ${
    isActive
      ? "bg-green-600 text-white"
      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
  }`;

const AdminLayout = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Panou de administrare
      </h1>

      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="bg-white rounded-xl shadow p-4 h-fit space-y-1">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/categories" className={linkClass}>
            Categorii
          </NavLink>
          <NavLink to="/admin/supplements" className={linkClass}>
            Suplimente
          </NavLink>
          <NavLink to="/admin/diseases" className={linkClass}>
            Afectiuni
          </NavLink>
        </aside>

        <main className="bg-white rounded-xl shadow p-6 min-h-[400px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
