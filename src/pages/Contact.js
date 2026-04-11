import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import Message from "../components/Message";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Te rugam sa completezi toate campurile obligatorii.");
      return;
    }
    // Demo only — no backend endpoint. Simulate success.
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Contact</h1>
        <p className="text-gray-500">
          Ai intrebari despre produse sau comenzi? Suntem aici sa te ajutam.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1.5fr] gap-6">
        {/* Contact info */}
        <aside className="bg-white rounded-2xl shadow p-6 h-fit space-y-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Date de contact
          </h2>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
              <FaPhone className="phone-icon" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Telefon</div>
              <a href="tel:+40772027622" className="font-semibold text-gray-800 hover:text-green-700">
                0772 027 622
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
              <FaEnvelope />
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <a
                href="mailto:contact@suplimente.ro"
                className="font-semibold text-gray-800 hover:text-green-700"
              >
                contact@suplimente.ro
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
              <FaMapMarkerAlt />
            </div>
            <div>
              <div className="text-sm text-gray-500">Adresa</div>
              <div className="font-semibold text-gray-800">
                Strada Exemplu, Nr. 10
                <br />
                Bucuresti, Romania
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
              <FaClock />
            </div>
            <div>
              <div className="text-sm text-gray-500">Program</div>
              <div className="font-semibold text-gray-800">
                Luni–Vineri: 09:00–18:00
              </div>
            </div>
          </div>
        </aside>

        {/* Contact form */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Trimite-ne un mesaj
          </h2>

          {sent && (
            <Message type="success">
              Mesajul a fost trimis! (demo — nu e conectat la un backend real)
            </Message>
          )}
          {error && <Message type="error">{error}</Message>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nume *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subiect
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Intrebare despre un produs"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mesaj *
              </label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Scrie aici mesajul tau..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg transition"
            >
              Trimite mesaj
            </button>

            <p className="text-xs text-gray-400">
              * campuri obligatorii. Formularul este demonstrativ — nu e conectat la un server de email.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;
