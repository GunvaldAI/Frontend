import React, { useEffect, useState } from 'react';

/**
 * Hero section inspired by the Readdy design.  Provides a vibrant, animated
 * background with multiple gradient layers and a halo that follows the mouse
 * position.  Displays a large Finnish headline, descriptive tagline and two
 * call‑to‑action buttons.  Beneath the CTA buttons, a three‑card feature grid
 * introduces core capabilities like content generation, scheduling and analytics.
 */
const ReaddyHeroSection = () => {
  // Track the mouse position to position an interactive halo that follows
  // the pointer.  This creates a dynamic lighting effect similar to the
  // original Readdy hero.
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative py-20 lg:py-28 min-h-[80vh] flex items-center overflow-hidden">
      {/* Radiant animated gradient backdrop */}
      <div className="absolute inset-0">
        {/* Base pastel gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100"></div>
        {/* Additional pulsing gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-200/80 via-transparent to-blue-200/80 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-pink-200/60 via-transparent to-purple-200/60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-200/50 via-transparent to-indigo-200/50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        {/* Radiant orbs to add depth */}
        <div className="absolute top-1/5 right-1/4 w-60 h-60 bg-gradient-radial from-purple-400/30 via-violet-300/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/5 left-1/4 w-80 h-80 bg-gradient-radial from-blue-400/25 via-cyan-300/15 to-transparent rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute top-3/5 right-1/6 w-40 h-40 bg-gradient-radial from-pink-400/35 via-rose-300/25 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        {/* Interactive halo following the mouse */}
        <div
          className="absolute w-[1000px] h-[1000px] opacity-60 animate-pulse pointer-events-none"
          style={{
            left: `${mousePosition.x - 500}px`,
            top: `${mousePosition.y - 500}px`,
            background:
              'radial-gradient(circle, rgba(147,51,234,0.25) 0%, rgba(59,130,246,0.2) 20%, rgba(16,185,129,0.15) 40%, rgba(236,72,153,0.1) 60%, transparent 100%)',
            filter: 'blur(80px)',
            transition: 'left 0.3s ease-out, top 0.3s ease-out',
          }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            Älykkäät AI‑työkalut sisällöntuottajille
          </h1>
          <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Generoi, ajasta ja seuraa sisältösi kaikilla alustoilla älykkään avustajan avulla.
            Tehosta työskentelyäsi ja kasvata yleisöäsi.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/sign-up"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl"
            >
              Aloita
            </a>
            <a
              href="/demo"
              className="border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-white/50 px-8 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              Katso demo
            </a>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-2xl mx-auto mb-6">
                <i className="ri-magic-line text-gray-700 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sisällöntuotanto</h3>
              <p className="text-gray-600 text-sm">Luo sisältöä kehittyneellä tekoälyllä</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-2xl mx-auto mb-6">
                <i className="ri-calendar-schedule-line text-gray-700 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ajastus</h3>
              <p className="text-gray-600 text-sm">Optimoi julkaisuaikasi automaattisesti</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-2xl mx-auto mb-6">
                <i className="ri-bar-chart-box-line text-gray-700 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Analytiikka</h3>
              <p className="text-gray-600 text-sm">Seuraa suoritustasi reaaliajassa</p>
            </div>
          </div>
        </div>
      </div>
      {/* Fade at bottom to transition into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 via-white/40 to-transparent"></div>
    </section>
  );
};

export default ReaddyHeroSection;