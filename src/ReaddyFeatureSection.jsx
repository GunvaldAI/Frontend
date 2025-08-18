import React from 'react';

/**
 * FeatureSection inspired by the Readdy example.  Presents a headline and
 * description followed by a grid of feature cards.  Each card includes an
 * icon, heading and short description.  At the bottom of the section, a
 * gradient call‑to‑action panel invites users to start a free trial or view a demo.
 */
const features = [
  {
    icon: 'ri-flashlight-line',
    title: 'Välitön sisältö',
    description: 'Generoi valmiit julkaisut sekunneissa.',
  },
  {
    icon: 'ri-global-line',
    title: 'Globaali tavoittavuus',
    description: 'Julkaise useille alustoille yhdellä kertaa.',
  },
  {
    icon: 'ri-bar-chart-line',
    title: 'AI‑näkemykset',
    description: 'Analysoi sisältösi toimivuutta tekoälyn avulla.',
  },
  {
    icon: 'ri-time-line',
    title: 'Ajastetut julkaisut',
    description: 'Suunnittele ja ajasta julkaisusi etukäteen.',
  },
  {
    icon: 'ri-gallery-line',
    title: 'Monipuolinen media',
    description: 'Käytä kuvia, videoita ja ääniklippejä saumattomasti.',
  },
  {
    icon: 'ri-team-line',
    title: 'Tiimin tuki',
    description: 'Yhdessä luominen ja yhteistyö tiimisi kanssa.',
  },
];

const ReaddyFeatureSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-white relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Kaikki mitä tarvitset menestyä sosiaalisessa mediassa
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Gunvald tarjoaa kattavan työkalupakin sisällön luomiseen, ajastukseen ja analysointiin.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="group relative bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-6 bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-md">
                <i className={`${feat.icon} text-xl`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{feat.title}</h3>
              <p className="text-gray-600 text-sm">{feat.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-20 relative rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 text-white p-12 text-center shadow-xl">
          <h3 className="text-3xl font-bold mb-4">Valmiina uudistamaan sosiaalisen median strategiasi?</h3>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Hyödynnä älykäs avustajamme ja ota sosiaalinen media haltuun. Aloita ilmainen kokeilu
            ja katso itse tulokset.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/sign-up"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Aloita ilmainen kokeilu
            </a>
            <a
              href="/demo"
              className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition"
            >
              Katso demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReaddyFeatureSection;