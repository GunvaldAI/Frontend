import React from 'react';

/**
 * FeaturesSection component
 *
 * Renders a list of features in a responsive grid. Each feature object
 * should have `title`, `description` and optionally `icon` (React element
 * or image URL). If no features are provided, a basic set of default
 * features is used. This component uses Tailwind CSS classes for layout.
 *
 * Props:
 * - heading: section title
 * - features: array of { title, description, icon }
 */
function FeaturesSection({
  heading = 'Miksi valita Gunvald?',
  features = [
    {
      title: 'Automaattinen sisällöntuotanto',
      description: 'Generoi viikkosuunnitelmat ja postaukset tekoälyn avulla.',
    },
    {
      title: 'Brändin mukauttaminen',
      description: 'Säädä äänen sävy, värit ja tyyli vastaamaan yrityksesi ilmettä.',
    },
    {
      title: 'Ajastus ja julkaisu',
      description: 'Aikatauluta postaukset ja julkaise ne automaattisesti eri kanaviin.',
    },
  ],
}) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          {heading}
        </h3>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              {feat.icon && typeof feat.icon === 'string' && (
                <img src={feat.icon} alt="" className="h-12 w-12 mb-4" />
              )}
              {feat.icon && typeof feat.icon !== 'string' && (
                <div className="text-primary-600 mb-4 text-3xl">{feat.icon}</div>
              )}
              <h4 className="text-xl font-semibold mb-2 text-gray-800">
                {feat.title}
              </h4>
              <p className="text-gray-600">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
