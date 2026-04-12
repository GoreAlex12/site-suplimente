import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition placeholder:text-gray-400";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center mb-4 border border-green-100">
              <FaLock size={20} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Autentificare Admin
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Introdu datele pentru a accesa panoul de administrare.
            </p>
          </div>

          {error && <Message type="error">{error}</Message>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@exemplu.ro"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Parola
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              {loading ? "Se autentifica..." : "Autentificare"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
