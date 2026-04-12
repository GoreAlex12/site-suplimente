import React from "react";
import { Link } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import logo from "../assets/logo.svg";

const footerLinks = {
  Magazin: [
    { label: "Toate produsele", to: "/products" },
    { label: "Promotii", to: "/promotii" },
    { label: "Producatori", to: "/producatori" },
    { label: "Afectiuni", to: "/diseases" },
  ],
  Informatii: [
    { label: "Despre noi", to: "/despre-noi" },
    { label: "Livrare si transport", to: "/livrare" },
    { label: "Termeni si conditii", to: "/termeni" },
    { label: "Prelucrare date personale", to: "/confidentialitate" },
  ],
  Cont: [
    { label: "Cosul meu", to: "/cart" },
    { label: "Contact", to: "/contact" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand + contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <img
                src={logo}
                alt="Logo"
                className="h-10 brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
              Suplimente naturale de calitate premium, selectate cu grija pentru
              sanatatea ta si a familiei tale.
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <FaPhone className="text-green-500 flex-shrink-0 rotate-90" size={13} />
                <a
                  href="tel:+40772027622"
                  className="hover:text-white transition-colors"
                >
                  0772 027 622
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-green-500 flex-shrink-0" size={13} />
                <a
                  href="mailto:contact@suplimente.ro"
                  className="hover:text-white transition-colors"
                >
                  contact@suplimente.ro
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-green-500 flex-shrink-0" size={13} />
                <span>Bucuresti, Romania</span>
              </li>
              <li className="flex items-center gap-3">
                <FaClock className="text-green-500 flex-shrink-0" size={13} />
                <span>Luni – Vineri: 09:00 – 18:00</span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Suplimente Naturale. Toate
            drepturile rezervate.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-green-600 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              aria-label="Facebook"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-green-600 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              aria-label="Instagram"
            >
              <FaInstagram size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
