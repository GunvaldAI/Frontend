import React from 'react';

/**
 * Footer component inspired by the Readdy design.  Uses a dark background with
 * multiple columns for product, company, resources and legal links, plus
 * company description and social icons.  Includes a copyright notice.
 */
const ReaddyFooter = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-200 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company info */}
        <div>
          <h4 className="text-xl font-bold mb-4 text-white">Gunvald</h4>
          <p className="text-gray-400 text-sm mb-4">
            Tekoälyavusteinen sosiaalisen median assistentti.
          </p>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <i className="ri-twitter-x-line text-2xl"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <i className="ri-facebook-line text-2xl"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <i className="ri-linkedin-line text-2xl"></i>
            </a>
          </div>
        </div>
        {/* Product links */}
        <div>
          <h5 className="text-lg font-semibold mb-3 text-white">Tuote</h5>
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="hover:underline">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/dashboard/scheduler" className="hover:underline">
                Ajastus
              </a>
            </li>
            <li>
              <a href="/dashboard/analytics" className="hover:underline">
                Analytiikka
              </a>
            </li>
          </ul>
        </div>
        {/* Company links */}
        <div>
          <h5 className="text-lg font-semibold mb-3 text-white">Yritys</h5>
          <ul className="space-y-2">
            <li>
              <a href="/info" className="hover:underline">
                Meistä
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Yhteystiedot
              </a>
            </li>
            <li>
              <a href="/pricing" className="hover:underline">
                Hinnoittelu
              </a>
            </li>
          </ul>
        </div>
        {/* Legal links */}
        <div>
          <h5 className="text-lg font-semibold mb-3 text-white">Lakiasiat</h5>
          <ul className="space-y-2">
            <li>
              <a href="/terms-of-use" className="hover:underline">
                Käyttöehdot
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline">
                Tietosuoja
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        © {year} Gunvald. Kaikki oikeudet pidätetään.
      </div>
    </footer>
  );
};

export default ReaddyFooter;