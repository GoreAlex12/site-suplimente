import React, { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";
import Message from "../components/Message";

const infoItems = [
  {
    icon: <FaPhone className="phone-icon" />,
    label: "Telefon",
    value: "0772 027 622",
    href: "tel:+40772027622",
  },
  {
    icon: <FaEnvelope />,
    label: "Email",
    value: "contact@suplimente.ro",
    href: "mailto:contact@suplimente.ro",
  },
  {
    icon: <FaMapMarkerAlt />,
    label: "Adresa",
    value: "Strada Exemplu, Nr. 10\nBucuresti, Romania",
  },
  {
    icon: <FaClock />,
    label: "Program",
    value: "Luni – Vineri: 09:00 – 18:00",
  },
];

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
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
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition placeholder:text-gray-400";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Contact
        </h1>
        <p className="text-gray-500 max-w-lg">
          Ai intrebari despre produse sau comenzi? Suntem aici sa te ajutam.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1.5fr] gap-6">
        {/* Contact info */}
        <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit space-y-5">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Date de contact
          </h2>

          {infoItems.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0 border border-green-100">
                {item.icon}
              </div>
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                  {item.label}
                </div>
                {item.href ? (
                  <a
                    href={item.href}
                    className="font-semibold text-gray-800 hover:text-green-700 transition-colors text-sm"
                  >
                    {item.value}
                  </a>
                ) : (
                  <div className="font-semibold text-gray-800 text-sm whitespace-pre-line">
                    {item.value}
                  </div>
                )}
              </div>
            </div>
          ))}
        </aside>

        {/* Contact form */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5">
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Nume *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Numele tau"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="exemplu@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Subiect
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Intrebare despre un produs"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Mesaj *
              </label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Scrie aici mesajul tau..."
                className={inputClass + " resize-none"}
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <FaPaperPlane size={12} />
              Trimite mesaj
            </button>

            <p className="text-xs text-gray-400">
              * campuri obligatorii. Formularul este demonstrativ.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;
