import React, { useState } from 'react';
// Import the Gunvald logo.  Vite will handle SVG imports as data URIs
// so we can use the image directly in the header.  The file lives
// alongside this component in the src directory.
import GunvaldLogo from './gunvald-logo.svg';
import { SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';

/**
 * Header component inspired by the Readdy design.  Displays a logo, navigation
 * links and call‑to‑action buttons.  The navigation adapts for desktop and
 * mobile and integrates Gunvald's authentication using Clerk.  When the
 * user is signed out, "Kirjaudu sisään" and "Aloita nyt" buttons are
 * displayed; when signed in, the header shows a "Luo postaus" button and
 * a sign‑out control.
 */
const ReaddyHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useClerk();

  // Determine if we are on the home (landing) page.  When on the
  // landing page the header should integrate seamlessly with the hero
  // section by using lighter text colours.  Since window is undefined
  // during server rendering, guard against its absence.
  const isHome = typeof window !== 'undefined' && window.location.pathname === '/';
  // Determine header styling based on page.  On the landing page
  // we use a transparent background so the hero section shows through,
  // and light text for maximum contrast.  On other pages (pricing,
  // terms, etc.) we switch to a light background with dark text.
  // Compute the header styling based on whether we are on the landing page.
  // On the home page we use a transparent background so the hero section
  // shows through and add a subtle white border.  On other pages we use
  // a nearly white background with a light grey border.  This approach
  // mirrors the Readdy header design, which blends into the hero while
  // maintaining separation from the rest of the content.
  const headerClasses = isHome
    ? 'bg-transparent backdrop-blur-md border-b border-white/20'
    : 'bg-white/95 border-b border-gray-200';

  return (
    <header className={`${headerClasses} shadow-sm relative`}>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            {/* Use the actual logo instead of a placeholder icon and text */}
            <img src={GunvaldLogo} alt="Gunvald logo" className="h-8 w-auto" />
          </a>
        </div>
        {/* Navigation – desktop */}
        <nav className="hidden lg:flex items-center space-x-1">
          {/* Each link shares common spacing and rounding.  The colours differ
             depending on the page: white text on the home page and
             dark grey text on other pages.  Hover backgrounds use
             translucent white on home (to show the hero through) and
             light grey on other pages. */}
          <a
            href="/dashboard"
            className={
              `${isHome ? 'text-white hover:text-white/80 hover:bg-white/20' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} ` +
              'transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-md'
            }
          >
            Hallintapaneeli
          </a>
          <a
            href="/dashboard/scheduler"
            className={
              `${isHome ? 'text-white hover:text-white/80 hover:bg-white/20' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} ` +
              'transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-md'
            }
          >
            Ajastus
          </a>
          <a
            href="/dashboard/analytics"
            className={
              `${isHome ? 'text-white hover:text-white/80 hover:bg-white/20' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} ` +
              'transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-md'
            }
          >
            Analytiikka
          </a>
          <a
            href="/pricing"
            className={
              `${isHome ? 'text-white hover:text-white/80 hover:bg-white/20' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} ` +
              'transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-md'
            }
          >
            Hinnoittelu
          </a>
        </nav>
        {/* CTA buttons – desktop */}
        <div className="hidden lg:flex items-center space-x-3">
          <SignedOut>
            <>
              <a
                href="/sign-in"
                className={`${isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-200 text-sm font-medium px-4 py-2 whitespace-nowrap`}
              >
                Kirjaudu sisään
              </a>
              <a
                href="/sign-up"
                className={`${isHome ? 'border border-white text-white hover:bg-white hover:text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap shadow-lg`}
              >
                Aloita nyt
              </a>
            </>
          </SignedOut>
          <SignedIn>
            <>
              <a
                href="/action"
                className={`${isHome ? 'border border-white text-white hover:bg-white hover:text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap shadow-lg`}
              >
                Luo postaus
              </a>
              <button
                onClick={() => signOut()}
                className={`${isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-200 text-sm font-medium px-4 py-2 whitespace-nowrap`}
              >
                Kirjaudu ulos
              </button>
            </>
          </SignedIn>
        </div>
        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={
            `lg:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ` +
            (isHome
              ? 'text-white hover:text-white/80 hover:bg-white/20'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100')
          }
        >
          <i className={`${menuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div
          className={
            `lg:hidden py-4 border-t ` +
            (isHome ? 'border-white/20' : 'border-gray-200 bg-white/95')
          }
        >
          <nav className="flex flex-col space-y-1 px-6">
            <a
              href="/dashboard"
              className={
                `${isHome ? 'text-white hover:text-white/80 hover:bg-white/20' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} ` +
                'transition-colors duration-200 text-sm font-medium px-4 py-3 rounded-lg'
              }
            >
              Hallintapaneeli
            </a>
            <a
              href="/dashboard/scheduler"
              className={
                `${isHome ? 'text-white hover:text-white/80 hover:bg-white/20' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} ` +
                'transition-colors duration-200 text-sm font-medium px-4 py-3 rounded-lg'
              }
            >
              Ajastus
            </a>
            <a
              href="/dashboard/analytics"
              className={
                `${isHome ? 'text-white hover:text-white/80 hover:bg-white/20' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} ` +
                'transition-colors duration-200 text-sm font-medium px-4 py-3 rounded-lg'
              }
            >
              Analytiikka
            </a>
            <a
              href="/pricing"
              className={
                `${isHome ? 'text-white hover:text-white/80 hover:bg-white/20' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} ` +
                'transition-colors duration-200 text-sm font-medium px-4 py-3 rounded-lg'
              }
            >
              Hinnoittelu
            </a>
            <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
              <SignedOut>
                <>
                  <a
                    href="/sign-in"
                    className={`${isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-200 text-sm font-medium px-4 py-3 rounded-lg hover:bg-white/30`}
                  >
                    Kirjaudu sisään
                  </a>
                  <a
                    href="/sign-up"
                    className={`${isHome ? 'border border-white text-white hover:bg-white hover:text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-center whitespace-nowrap shadow-lg`}
                  >
                    Aloita nyt
                  </a>
                </>
              </SignedOut>
              <SignedIn>
                <>
                  <a
                    href="/action"
                    className={`${isHome ? 'border border-white text-white hover:bg-white hover:text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-center whitespace-nowrap shadow-lg`}
                  >
                    Luo postaus
                  </a>
                  <button
                    onClick={() => signOut()}
                    className={`${isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-200 text-sm font-medium px-4 py-3 rounded-lg hover:bg-white/30 text-left`}
                  >
                    Kirjaudu ulos
                  </button>
                </>
              </SignedIn>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default ReaddyHeader;