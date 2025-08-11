import React from 'react';

/**
 * HeroSection component
 *
 * Displays a large hero banner with a headline, optional subtitle,
 * call‑to‑action button and background image. All props are optional
 * and have sensible defaults so that the component works out of the box.
 *
 * Props:
 * - title: main heading text
 * - subtitle: subheading text
 * - buttonLabel: text for the CTA button
 * - onButtonClick: click handler for the CTA button
 * - imageUrl: URL of the background image (positioned right on large screens)
 */
function HeroSection({
  title = 'Tervetuloa Gunvaldiin',
  subtitle = 'Tekoälyavusteinen sosiaalisen median assistentti',
  buttonLabel = 'Aloita nyt',
  onButtonClick = () => {},
  imageUrl,
}) {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            {title}
          </h2>
          {subtitle && <p className="text-lg md:text-xl text-purple-200">{subtitle}</p>}
          {buttonLabel && (
            <button
              onClick={onButtonClick}
              className="mt-4 inline-block bg-white text-gray-800 font-semibold py-3 px-8 rounded-full shadow hover:bg-gray-200 transition"
            >
              {buttonLabel}
            </button>
          )}
        </div>
        {imageUrl && (
          <div className="hidden md:block">
            <img
              src={imageUrl}
              alt="Hero illustration"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;
