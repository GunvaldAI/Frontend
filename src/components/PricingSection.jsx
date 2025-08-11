import React from 'react';

/**
 * PricingSection component
 *
 * Displays a set of pricing plans with their features and call‑to‑action buttons.
 * Each plan object should include a `name`, `price`, `description`,
 * `features` array and optional `ctaLabel`. A default set of plans is
 * provided if none are passed.
 *
 * Props:
 * - heading: section heading
 * - plans: array of plan objects
 */
function PricingSection({
  heading = 'Hinnoittelu',
  plans = [
    {
      name: 'Starter',
      price: '\u20ac49 / kk',
      description: 'Kaikki perustoiminnot pienyrityksille.',
      features: [
        'Viikkosuunnitelmat',
        'Perusbr\u00e4ndin asetukset',
        'Rajoitettu kuvagenerointi',
      ],
      ctaLabel: 'Aloita',
    },
    {
      name: 'Pro',
      price: '\u20ac99 / kk',
      description: 'Laajennetut toiminnot kasvaville tiimeille.',
      features: [
        'Rajattomat postaukset',
        'T\u00e4ysi br\u00e4ndin hallinta',
        'Premium kuvat ja AI-sis\u00e4lt\u00f6',
        'Ajastus ja julkaisujonot',
      ],
      ctaLabel: 'Kokeile Pro',
    },
  ],
}) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-10">{heading}</h3>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-8 flex flex-col shadow hover:shadow-lg transition"
            >
              <h4 className="text-2xl font-semibold mb-2 text-gray-800">
                {plan.name}
              </h4>
              <p className="text-4xl font-bold mb-4 text-primary-600">
                {plan.price}
              </p>
              <p className="mb-6 text-gray-600">{plan.description}</p>
              <ul className="flex-1 space-y-2 text-left mb-6">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button
                className="bg-primary-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-primary-700 transition"
              >
                {plan.ctaLabel || 'Valitse'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
